// @flow
import { NativeModules, Platform } from 'react-native';
import RNWebView from 'react-native-webview';
import { isCvv4Length } from './cvv-utils';

const Native = NativeModules.RNCloudipsp;

export class Currency {
  constructor(code: string) {
    this.code = code;
  }

  toString() {
    return this.code;
  }
}

Currency.UAH = new Currency('UAH');
Currency.USD = new Currency('USD');
Currency.RUB = new Currency('RUB');
Currency.EUR = new Currency('EUR');
Currency.GBP = new Currency('GBP');
Currency.KZT = new Currency('KZT');

export class Lang {
  constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

Lang.RU = new Lang('ru');
Lang.UK = new Lang('uk');
Lang.EN = new Lang('en');
Lang.LV = new Lang('lv');
Lang.FR = new Lang('fr');

export class Verification {
  constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

Verification.AMOUNT = new Verification('amount');
Verification.CODE = new Verification('code');

function req(name: string) {
  throw new Error('Parameter "' + name + '" is required');
}

export class Order {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  email: string;

  constructor(amount: number = req('amount'),
              currency: Currency | string = req('currency'),
              orderId: string = req('orderId'),
              description: string = req('description'),
              email: string) {

    this.amount = amount;
    if (typeof currency === 'string') {
      this.currency = currency;
    } else {
      this.currency = currency.code;
    }
    this.orderId = orderId;
    this.description = description;
    this.email = email;
    this.setPreAuth(false);
    this.setRequiredRecToken(false);
    this.setVerificationType(Verification.AMOUNT);
    this.arguments = {};
  }

  setProductId(productId: string) {
    this.productId = productId;
  }

  setPaymentSystems(paymentSystems: string) {
    this.paymentSystems = paymentSystems;
  }

  setDefaultPaymentSystem(defaultPaymentSystem: string) {
    this.defaultPaymentSystem = defaultPaymentSystem;
  }

  setLifeTime(lifeTime: Number) {
    this.lifeTime = lifeTime;
  }

  setMerchantData(merchantData: string) {
    this.merchantData = merchantData;
  }

  setVersion(version: string) {
    this.version = version;
  }

  setServerCallbackUrl(serverCallbackUrl: string) {
    this.serverCallbackUrl = serverCallbackUrl;
  }

  setLang(lang: Lang) {
    this.lang = lang;
  }

  setPreAuth(preAuth: Boolean) {
    this.preAuth = preAuth;
  }

  setRequiredRecToken(requiredRecToken: Boolean) {
    this.requiredRecToken = requiredRecToken;
  }

  setVerification(verification: Boolean) {
    this.verification = verification;
  }

  setVerificationType(verificationType: Verification) {
    this.verificationType = verificationType;
  }

  setRecToken(recToken: string) {
    this.recToken = recToken;
  }

  addArgument(name: string, value: string) {
    this.arguments[name] = value;
  }
}

export class Card {
  getSource = () => {
    return 'form';
  };

  __getCardNumber__ = () => {
  };
  __getExpYy__ = () => {
  };
  __getExpMm__ = () => {
  };
  __getCvv__ = () => {
  };

  __lunaCheck__ = (cardNumber) => {
    let sum = 0;
    let odd = true;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      try {
        let num = Number(cardNumber.charAt(i));
        odd = !odd;
        if (odd) {
          num *= 2;
        }
        if (num > 9) {
          num -= 9;
        }
        sum += num;
      } catch (e) {
        return false;
      }
    }

    return sum % 10 === 0;
  };

  isValidCardNumber = () => {
    let cardNumber = this.__getCardNumber__();
    if (!(12 <= cardNumber.length && cardNumber.length <= 19)) {
      return false;
    }
    return this.__lunaCheck__(cardNumber);
  };

  __isValidExpireMonthValue__ = (mm) => {
    return mm >= 1 && mm <= 12;
  };

  isValidExpireMonth = () => {
    let mm = this.__getExpMm__();
    return this.__isValidExpireMonthValue__(mm);
  };

  __isValidExpireYearValue__ = (yy) => {
    return yy >= 19 && yy <= 99;
  };

  isValidExpireYear = () => {
    let yy = this.__getExpYy__();
    if (!this.__isValidExpireYearValue__(yy)) {
      return false;
    }
    let year = new Date().getFullYear() - 2000;
    return year <= yy;
  };

  isValidExpireDate = () => {
    let mm = this.__getExpMm__();
    if (!this.__isValidExpireMonthValue__(mm)) {
      return false;
    }
    let yy = this.__getExpYy__();
    if (!this.__isValidExpireYearValue__(yy)) {
      return false;
    }

    let now = new Date();
    let year = now.getFullYear() - 2000;
    let month = now.getMonth() + 1;

    return (yy > year) || (yy >= year && mm >= month);
  };

  isValidCvv = () => {
    let cvv = this.__getCvv__();
    if (isCvv4Length(this.__getCardNumber__())) {
      return cvv.length === 4;
    } else {
      return cvv.length === 3;
    }
  };

  isValidCard = () => {
    return this.isValidCardNumber() && this.isValidExpireDate() && this.isValidCvv();
  };
}

export class Receipt {
  maskedCard: string;
  cardBin: string;
  amount: number;
  paymentId: number;
  currency: string;
  status: string;
  transactionType: string;
  senderCellPhone: string;
  senderAccount: string;
  cardType: string;
  rrn: string;
  approvalCode: string;
  responseCode: string;
  productId: string;
  recToken: string;
  recTokenLifeTime: Date;
  reversalAmount: number;
  settlementAmount: number;
  settlementCurrency: string;
  settlementDate: Date;
  eci: number;
  fee: number;
  actualAmount: number;
  actualCurrency: string;
  paymentSystem: string;
  verificationStatus: string;
  signature: string;
  responseUrl: string;

  constructor(maskedCard: string,
              cardBin: number,
              amount: number,
              paymentId: number,
              currency: string,
              status: string,
              transactionType: string,
              senderCellPhone: string,
              senderAccount: string,
              cardType: string,
              rrn: string,
              approvalCode: string,
              responseCode: string,
              productId: string,
              recToken: string,
              recTokenLifeTime: Date,
              reversalAmount: number,
              settlementAmount: number,
              settlementCurrency: string,
              settlementDate: Date,
              eci: number,
              fee: number,
              actualAmount: number,
              actualCurrency: string,
              paymentSystem: string,
              verificationStatus: string,
              signature: string,
              responseUrl: string) {
    this.maskedCard = maskedCard;
    this.cardBin = cardBin;
    this.amount = amount;
    this.paymentId = paymentId;
    this.currency = currency;
    this.status = status;
    this.transactionType = transactionType;
    this.senderCellPhone = senderCellPhone;
    this.senderAccount = senderAccount;
    this.cardType = cardType;
    this.rrn = rrn;
    this.approvalCode = approvalCode;
    this.responseCode = responseCode;
    this.productId = productId;
    this.recToken = recToken;
    this.recTokenLifeTime = recTokenLifeTime;
    this.reversalAmount = reversalAmount;
    this.settlementAmount = settlementAmount;
    this.settlementCurrency = settlementCurrency;
    this.settlementDate = settlementDate;
    this.eci = eci;
    this.fee = fee;
    this.actualAmount = actualAmount;
    this.actualCurrency = actualCurrency;
    this.paymentSystem = paymentSystem;
    this.verificationStatus = verificationStatus;
    this.signature = signature;
    this.responseUrl = responseUrl;
  }

  static __fromOrderData__(orderData, responseUrl) {
    let recTokenLifeTime;
    try {
      recTokenLifeTime = Date.parse(orderData.rectoken_lifetime);
    } catch (e) {
      recTokenLifeTime = undefined;
    }
    let settlementDate;
    try {
      recTokenLifeTime = Date.parse(orderData.rectoken_lifetime);
    } catch (e) {
      recTokenLifeTime = undefined;
    }

    let receipt = new Receipt
    (
      orderData.masked_card,
      orderData.card_bin,
      Number(orderData.amount),
      orderData.payment_id,
      orderData.currency,
      orderData.order_status,
      orderData.tran_type,
      orderData.sender_cell_phone,
      orderData.sender_account,
      orderData.card_type,
      orderData.rrn,
      orderData.approval_code,
      orderData.response_code,
      orderData.product_id,
      orderData.rectoken,
      recTokenLifeTime,
      orderData.reversal_amount,
      orderData.settlement_amount,
      orderData.settlement_currency,
      settlementDate,
      orderData.eci,
      orderData.fee,
      orderData.actual_amount,
      orderData.actual_currency,
      orderData.payment_system,
      orderData.verification_status,
      orderData.signature,
      responseUrl
    );
    receipt.dumpFields = () => {
      return orderData;
    };
    return receipt;
  }
}

export class Failure extends Error {
  constructor(message, errorCode, requestId) {
    super(message);
    this.errorCode = errorCode;
    this.requestId = requestId;
  }

  toString() {
    return 'Failure. ' + super.toString() + ', errorCode: ' + this.errorCode + ', requestId: ' + this.requestId;
  }
}

export class Cloudipsp {
  constructor(merchantId: number = req('merchantId'), cloudipspView = req('cloudipspView')) {
    this.__merchantId__ = merchantId;
    this.__baseUrl__ = 'https://api.fondy.eu';
    this.__callbackUrl__ = 'http://callback';
    this.__cloudipspView__ = cloudipspView;

    if (!RNWebView) {
      throw new Error('"react-native-webview" module required');
    }
  }

  static supportsApplePay(): Promise<boolean> {
    if (Platform.OS === 'ios' && Native) {
      return Native.supportsApplePay();
    } else {
      return Promise.resolve(false);
    }
  }

  static supportsGooglePay(): Promise<boolean> {
    if (Platform.OS === 'android' && Native) {
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

  payToken(card: Card = req('card'), token: string = req('token')): Promise<Receipt> {
    if (!card.isValidCard()) {
      throw new Error('Card is not valid');
    }

    let callbackUrl;
    return this.__getCallbackUrl__(token)
      .then((_callbackUrl) => {
        callbackUrl = _callbackUrl;
        return this.__checkout__(token, card);
      })
      .then((checkout) => this.__payContinue__(checkout, token, callbackUrl));
  }

  static __assertApplePay__() {
    if (Platform.OS !== 'ios') {
      return Promise.reject(new Error('ApplePay available only for iOS'));
    }
  }

  applePayToken(token: string = req('token')): Promise<Receipt> {
    Cloudipsp.__assertApplePay__();
    let config, applePayInfo, receiptFromToken, receiptFinal;
    return this.__order__(token)
      .then((receipt) => {
        receiptFromToken = receipt;
        return this.__getPaymentConfig__(null, token, 'https://apple.com/apple-pay', 'ApplePay');
      })
      .then((_config) => {
        config = _config;
        return Native.applePay(config.data, receiptFromToken.amount, receiptFromToken.currency, ' ');
      })
      .then((_applePayInfo) => {
        applePayInfo = _applePayInfo;
        return this.__checkoutApplePay__(token, receiptFromToken.email, config.payment_system, applePayInfo);
      })
      .then((checkout) => this.__payContinue__(checkout, token, receiptFromToken.responseUrl))
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
    let config, applePayInfo, token, receipt;
    return this.__getPaymentConfig__(order.currency, null, 'https://apple.com/apple-pay', 'ApplePay')
      .then((_config) => {
        config = _config;
        return Native.applePay(config.data, order.amount, order.currency, order.description);
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

  googlePayToken(token: string = req('token')): Promise<Receipt> {
    Cloudipsp.__assertGooglePay__();
    let config, googlePayInfo, receiptFromToken;
    return this.__order__(token)
      .then((receipt) => {
        receiptFromToken = receipt;
        return this.__getPaymentConfig__(null, token, 'https://google.com/pay', 'GooglePay')
      })
      .then((_config) => {
        config = _config;
        return Native.googlePay(config.data, receiptFromToken.amount, receiptFromToken.currency);
      })
      .then((_googlePayInfo) => {
        googlePayInfo = _googlePayInfo;
        return this.__checkoutGooglePay__(token, receiptFromToken.email, config.payment_system, googlePayInfo);
      })
      .then((checkout) => this.__payContinue__(checkout, token, receiptFromToken.responseUrl));
  }

  googlePay(order: Order = req('order')): Promise<Receipt> {
    Cloudipsp.__assertGooglePay__();
    let config, googlePayInfo, token;
    return this.__getPaymentConfig__(order.currency, null, 'https://google.com/pay', 'GooglePay')
      .then((_config) => {
        config = _config;
        return Native.googlePay(config.data, order.amount, order.currency);
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

  __getPaymentConfig__(currency: string, token: string, methodId: string, methodName: string): Promise<string> {
    const request = token ?
      { token } :
      {
        merchant_id: this.__merchantId__,
        currency
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

        return {
          payment_system: response.payment_system,
          data
        }
      });
  }

  __getToken__(order: Order): Promise<string> {
    let rqBody = {};
    rqBody.merchant_id = this.__merchantId__;
    rqBody.amount = String(order.amount);
    rqBody.currency = order.currency;
    rqBody.order_id = order.orderId;
    rqBody.order_desc = order.description;
    rqBody.email = order.email;
    if (order.productId !== undefined) {
      rqBody.product_id = product_id;
    }
    if (order.paymentSystems !== undefined) {
      rqBody.payment_systems = order.paymentSystems;
    }
    if (order.defaultPaymentSystem !== undefined) {
      rqBody.default_payment_system = order.defaultPaymentSystem;
    }
    if (order.lifeTime !== undefined) {
      rqBody.lifetime = order.lifeTime;
    }
    if (order.merchantData === undefined) {
      rqBody.merchant_data = '[]';
    } else {
      rqBody.merchant_data = order.merchantData;
    }
    if (order.version !== undefined) {
      rqBody.version = order.version;
    }
    if (order.serverCallbackUrl !== undefined) {
      rqBody.server_callback_url = order.serverCallbackUrl;
    }
    if (order.lang !== undefined) {
      rqBody.lang = order.lang.toString();
    }
    rqBody.preauth = order.preAuth ? 'Y' : 'N';
    rqBody.required_rectoken = order.requiredRecToken ? 'Y' : 'N';
    rqBody.verification = order.verification ? 'Y' : 'N';
    rqBody.verification_type = order.verificationType.name;

    rqBody = Object.assign(rqBody, order.arguments);

    rqBody.response_url = this.__callbackUrl__;
    rqBody.delayed = 'N';

    return this.__apiCall__('/api/checkout/token', rqBody)
      .then(response => response.token);
  }

  __checkout__(token, card, email) {
    const buildExp = (mm, yy) => {
      return (mm < 10 ? '0' : '') + mm + yy;
    };

    const rqBody = {
      card_number: card.__getCardNumber__(),
      expiry_date: buildExp(card.__getExpMm__(), card.__getExpYy__()),
      token,
      email,
      payment_system: 'card'
    };

    if (card.getSource() === 'form') {
      rqBody.cvv2 = card.__getCvv__();
    }

    return this.__apiCall__('/api/checkout/ajax', rqBody);
  }

  __checkoutApplePay__(token, email, paymentSystem, applePayData) {
    const rqBody = {
      token,
      email,
      payment_system: paymentSystem,
      data: applePayData
    };
    return this.__apiCall__('/api/checkout/ajax', rqBody);
  }

  __checkoutGooglePay__(token, email, paymentSystem, googlePayInfo) {
    const rqBody = {
      token,
      email,
      payment_system: paymentSystem,
      data: {
        apiVersion: '1',
        apiVersionMinor: '1',
        paymentMethodData: {
          description: googlePayInfo.description,
          type: 'CARD',
          info: {
            cardNetwork: googlePayInfo.cardNetwork,
            cardDetails: googlePayInfo.cardDetails
          },
          tokenizationData: {
            type: 'DIRECT',
            token: googlePayInfo.token
          }
        }
      }
    };
    return this.__apiCall__('/api/checkout/ajax', rqBody);
  }

  __payContinue__(checkoutResponse, token, callbackUrl) {
    const getOrder = () => this.__order__(token);

    if (checkoutResponse.url === callbackUrl) {
      return getOrder();
    } else {
      return this.__url3ds__(checkoutResponse, callbackUrl).then(getOrder);
    }
  }

  __url3ds__(checkout, callbackUrl) {
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
    let cookies;
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
        return this.__cloudipspView__((cloudipspView) => {
          return cloudipspView.__confirm__(checkout.url, html, cookies, this.__baseUrl__, callbackUrl);
        });
      });
  }

  __getCallbackUrl__(token: string) {
    return this.__apiCall__('/api/checkout/merchant/order', { token })
      .then((response) => {
        return response.response_url;
      });
  }

  __order__(token) {
    return this.__apiCall__('/api/checkout/merchant/order', { token })
      .then((response) => {
        return Receipt.__fromOrderData__(response.order_data, response.response_url);
      });
  }

  __apiCall__(path: string, request: any) {
    return this.__callJson__(path, request)
      .then((response) => {
        if (response.response_status === 'success') {
          return response;
        } else {
          this.__handleResponseError__(response)
        }
      });
  }

  __handleResponseError__(response) {
    throw new Failure(response.error_message, response.error_code, response.request_id);
  }

  __callJson__(path: string, request: any) {
    const url = this.__baseUrl__ + path;
    console.log(`Request. ${url}`, request);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'React-Native'
      },
      body: JSON.stringify({ request })
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(`Response. ${url}`, json);
        return json.response;
      });
  }
}
