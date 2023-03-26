import {Platform} from 'react-native';
import RNWebView from 'react-native-webview';

import {
  Card,
  CardPrivate,
  Failure,
  Order,
  OrderPrivate,
  Receipt,
  req,
} from './models';
import {
  CloudipspWebView,
  CloudipspWebviewPrivate,
  CloudipspWebviewProvider,
} from './CloudipspWebview';
import {Native} from './Native';

export class Cloudipsp {
  private readonly __merchantId__: number;
  private readonly __cloudipspView__: CloudipspWebviewProvider;

  private readonly __baseUrl__ = 'https://api.fondy.eu';
  private readonly __callbackUrl__ = 'http://callback';

  constructor(merchantId: number = req('merchantId'), cloudipspView: CloudipspWebviewProvider = req('cloudipspView')) {
    this.__merchantId__ = merchantId;
    this.__cloudipspView__ = cloudipspView;

    if (!RNWebView) {
      throw new Error('"react-native-webview" module required');
    }
  }

  static supportsApplePay(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return Native.supportsApplePay();
    } else {
      return Promise.resolve(false);
    }
  }

  static supportsGooglePay(): Promise<boolean> {
    if (Platform.OS === 'android') {
      return Native.supportsGooglePay();
    } else {
      return Promise.resolve(false);
    }
  }

  pay(card: Card = req('card'), order: Order = req('order')): Promise<Receipt> {
    if (!card.isValidCard()) {
      throw new Error('Card is not valid');
    }

    return this.__getToken__(order)
      .then((token) => {
        return this.__checkout__(token, card, order.email)
          .then((checkout) => this.__payContinue__(checkout, token, this.__callbackUrl__));
      });
  }

  public payToken(card: Card = req('card'), token: string = req('token')): Promise<Receipt> {
    if (!card.isValidCard()) {
      throw new Error('Card is not valid');
    }

    let callbackUrl: string;
    return this.__getCallbackUrl__(token)
      .then((_callbackUrl) => {
        callbackUrl = _callbackUrl;
        return this.__checkout__(token, card, undefined);
      })
      .then((checkout) => this.__payContinue__(checkout, token, callbackUrl));
  }

  public static __assertApplePay__() {
    if (Platform.OS !== 'ios') {
      return Promise.reject(new Error('ApplePay available only for iOS'));
    }
  }

  public applePayToken(token: string = req('token')): Promise<Receipt> {
    Cloudipsp.__assertApplePay__();
    let config: any, applePayInfo: any, receiptFromToken: Receipt, receiptFinal: Receipt;
    return this.__order__(token)
      .then((receipt) => {
        receiptFromToken = receipt;
        return this.__getPaymentConfig__(null, null, token, 'https://apple.com/apple-pay', 'ApplePay');
      })
      .then((_config) => {
        config = _config;
        return Native.applePay(config, receiptFromToken.amount, receiptFromToken.currency, ' ');
      })
      .then((_applePayInfo) => {
        applePayInfo = _applePayInfo;
        return this.__checkoutApplePay__(token, receiptFromToken.email, config.payment_system, applePayInfo);
      })
      .then((checkout) => this.__payContinue__(checkout, token, receiptFromToken.responseUrl!))
      .then((receipt) => {
        receiptFinal = receipt;
        return Native.applePayComplete(true);
      })
      .then(() => receiptFinal)
      .catch((error) => {
        Native.applePayComplete(false);
        throw error;
      });
  }

  applePay(order: Order = req('order')): Promise<Receipt> {
    Cloudipsp.__assertApplePay__();
    let config: any, applePayInfo: any, token: string, receipt: Receipt;
    return this.__getPaymentConfig__(order.amount, order.currency, null, 'https://apple.com/apple-pay', 'ApplePay')
      .then((_config) => {
        config = _config;
        return Native.applePay(config, order.amount, order.currency, order.description);
      })
      .then((_applePayInfo) => {
        applePayInfo = _applePayInfo;
        return this.__getToken__(order);
      })
      .then((_token) => {
        token = _token;
        return this.__checkoutApplePay__(token, order.email, config.payment_system, applePayInfo);
      })
      .then((checkout) => this.__payContinue__(checkout, token, this.__callbackUrl__))
      .then((_receipt) => {
        receipt = _receipt;
        return Native.applePayComplete(true);
      })
      .then(() => receipt)
      .catch((error) => {
        Native.applePayComplete(false);
        throw error;
      });
  }

  static __assertGooglePay__() {
    if (Platform.OS !== 'android') {
      return Promise.reject(new Error('GooglePay available only for Android'));
    }
  }

  public googlePayToken(token: string = req('token')): Promise<Receipt> {
    Cloudipsp.__assertGooglePay__();
    let config: any, receiptFromToken: Receipt;
    return this.__order__(token)
      .then((receipt) => {
        receiptFromToken = receipt;
        return this.__getPaymentConfig__(null, null, token, 'https://google.com/pay', 'GooglePay')
      })
      .then((_config) => {
        config = _config;
        return Native.googlePay(config.data);
      })
      .then((googlePayInfo) => {
        return this.__checkoutGooglePay__(token, receiptFromToken.email, config.payment_system, googlePayInfo);
      })
      .then((checkout) => this.__payContinue__(checkout, token, receiptFromToken.responseUrl!));
  }

  public googlePay(order: Order = req('order')): Promise<Receipt> {
    Cloudipsp.__assertGooglePay__();
    let config: any, googlePayInfo: any, token: string;
    return this.__getPaymentConfig__(order.amount, order.currency, null, 'https://google.com/pay', 'GooglePay')
      .then((_config) => {
        config = _config;
        return Native.googlePay(config.data);
      })
      .then((_googlePayInfo) => {
        googlePayInfo = _googlePayInfo;
        return this.__getToken__(order);
      })
      .then((_token) => {
        token = _token;
        return this.__checkoutGooglePay__(token, order.email, config.payment_system, googlePayInfo);
      })
      .then((checkout) => this.__payContinue__(checkout, token, this.__callbackUrl__));
  }

  private __getPaymentConfig__(
    amount: number | null,
    currency: string | null,
    token: string | null,
    methodId: string,
    methodName: string,
  ): Promise<any> {
    const request = token ?
      { token } :
      {
        merchant_id: this.__merchantId__,
        currency,
        amount
      };
    return this.__callJson__('/api/checkout/ajax/mobile_pay', request)
      .then((response) => {
        if (response.error_message) {
          this.__handleResponseError__(response);
        }
        let data;
        for (let i = 0; i < response.methods.length; ++i) {
          const method = response.methods[i];
          if (method.supportedMethods === methodId) {
            data = method.data;
            break;
          }
        }
        if (!data) {
          if (token) {
            throw new Error(`${methodName} is not supported for token "${token}"`);
          } else {
            throw new Error(`${methodName} is not supported for merchant ${this.__merchantId__} and currency ${currency}`);
          }
        }
        const totalDetails = response.details.total;

        return {
          payment_system: response.payment_system,
          data,
          businessName: totalDetails.label
        }
      });
  }

  private __getToken__(order: Order): Promise<string> {
    let rqBody: any = {};
    rqBody.merchant_id = this.__merchantId__;
    rqBody.amount = String(order.amount);
    rqBody.currency = order.currency;
    rqBody.order_id = order.orderId;
    rqBody.order_desc = order.description;
    rqBody.email = order.email;

    const orderPrivate = order as unknown as OrderPrivate;
    if (orderPrivate._productId) {
      rqBody.product_id = orderPrivate._productId;
    }
    if (orderPrivate._paymentSystems) {
      rqBody.payment_systems = orderPrivate._paymentSystems;
    }
    if (orderPrivate._defaultPaymentSystem) {
      rqBody.default_payment_system = orderPrivate._defaultPaymentSystem;
    }
    if (orderPrivate._lifeTime) {
      rqBody.lifetime = orderPrivate._lifeTime;
    }
    if (orderPrivate._merchantData === undefined) {
      rqBody.merchant_data = '[]';
    } else {
      rqBody.merchant_data = orderPrivate._merchantData;
    }
    if (orderPrivate._version) {
      rqBody.version = orderPrivate._version;
    }
    if (orderPrivate._serverCallbackUrl) {
      rqBody.server_callback_url = orderPrivate._serverCallbackUrl;
    }
    if (orderPrivate._lang) {
      rqBody.lang = orderPrivate._lang.toString();
    }
    rqBody.preauth = orderPrivate._preAuth ? 'Y' : 'N';
    rqBody.required_rectoken = orderPrivate._requiredRecToken ? 'Y' : 'N';
    rqBody.verification = orderPrivate._verification ? 'Y' : 'N';
    if (orderPrivate._verificationType) {
      rqBody.verification_type = orderPrivate._verificationType.name;
    }

    rqBody = Object.assign(rqBody, orderPrivate._arguments);

    rqBody.response_url = this.__callbackUrl__;
    rqBody.delayed = orderPrivate._delayed ? 'Y' : 'N';

    return this.__apiCall__('/api/checkout/token', rqBody)
      .then(response => response.token);
  }

  private __checkout__(token: string, card: Card, email: string | undefined) {
    const buildExp = (mm: number, yy: number) => {
      return (mm < 10 ? '0' : '') + mm + yy;
    };

    const cardPrivate = card as unknown as CardPrivate;

    const rqBody: any = {
      card_number: cardPrivate.__getCardNumber__(),
      expiry_date: buildExp(cardPrivate.__getExpMm__(), cardPrivate.__getExpYy__()),
      token,
      email,
      payment_system: 'card'
    };

    if (card.getSource() === 'form') {
      rqBody.cvv2 = cardPrivate.__getCvv__();
    }

    return this.__apiCall__('/api/checkout/ajax', rqBody);
  }

  private __checkoutApplePay__(
    token: string,
    email: string,
    paymentSystem: string,
    applePayData: any
  ): Promise<any> {
    const rqBody = {
      token,
      email,
      payment_system: paymentSystem,
      data: applePayData
    };
    return this.__apiCall__('/api/checkout/ajax', rqBody);
  }

  private __checkoutGooglePay__(
    token: string,
    email: string,
    paymentSystem: string,
    googlePayInfo: any,
  ): Promise<any> {
    const rqBody = {
      token,
      email,
      payment_system: paymentSystem,
      data: JSON.parse(googlePayInfo)
    };
    return this.__apiCall__('/api/checkout/ajax', rqBody);
  }

  private __payContinue__(checkoutResponse: any, token: string, callbackUrl: string) {
    const getOrder = () => this.__order__(token);

    if (checkoutResponse.url.startsWith(callbackUrl)) {
      return getOrder();
    } else {
      return this.__url3ds__(checkoutResponse, callbackUrl).then(getOrder);
    }
  }

  private __url3ds__(checkout: any, callbackUrl: string) {
    let body;
    let contentType;
    let sendData = checkout.send_data;
    if (sendData.PaReq === '') {
      body = JSON.stringify(sendData);
      contentType = 'application/json';
    } else {
      body = 'MD=' + encodeURIComponent(sendData.MD) +
        '&PaReq=' + encodeURIComponent(sendData.PaReq) +
        '&TermUrl=' + encodeURIComponent(sendData.TermUrl);
      contentType = 'application/x-www-form-urlencoded'
    }
    let cookies: string | null;
    return fetch(checkout.url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': contentType,
        'User-Agent': 'React-Native'
      },
      body: body
    })
      .then((response) => {
        cookies = response.headers.get('set-cookie');
        return response.text();
      })
      .then((html) => {
        return this.__cloudipspView__((cloudipspView: CloudipspWebView) => {
          const cloudipspViewPrivate = cloudipspView as unknown as CloudipspWebviewPrivate;
          return cloudipspViewPrivate.__confirm__(checkout.url, html, cookies, this.__baseUrl__, callbackUrl);
        });
      });
  }

  private __getCallbackUrl__(token: string): Promise<string> {
    return this.__apiCall__('/api/checkout/merchant/order', { token })
      .then((response) => {
        return response.response_url;
      });
  }

  private __order__(token: string): Promise<Receipt> {
    return this.__apiCall__('/api/checkout/merchant/order', { token })
      .then((response) => {
        return Receipt.__fromOrderData__(response.order_data, response.response_url);
      });
  }

  private __apiCall__(path: string, request: any): Promise<any> {
    return this.__callJson__(path, request)
      .then((response) => {
        if (response.response_status === 'success') {
          return response;
        } else {
          this.__handleResponseError__(response)
        }
      });
  }

  private __handleResponseError__(response: any): void {
    throw new Failure(response.error_message, response.error_code, response.request_id);
  }

  private __callJson__(path: string, request: any): Promise<any> {
    const url = this.__baseUrl__ + path;
    if (__DEV__) {
      console.log(`Request. ${url}`, request);
    }

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'React-Native',
        'SDK-OS': Platform.OS,
        'SDK-Version': '1.0.0'
      },
      body: JSON.stringify({ request })
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (__DEV__) {
          console.log(`Response. ${url}`, json);
        }
        return json.response;
      });
  }
}
