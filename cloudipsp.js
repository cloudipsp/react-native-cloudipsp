
export class Currency {
  constructor(code : string) {
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

export class Lang {
  constructor(name : string) {
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
  constructor(name : string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

Verification.AMOUNT = new Verification('amount');
Verification.CODE = new Verification('code');

function req(name : string) {
    throw new Error('Parameter "'+name+'" is required');
}

export class Order {
  constructor(
      amount : number = req('amount'),
      currency : Currency = req('currency'),
      orderId : string = req('orderId'),
      description : string = req('description'),
      email : string = req('email')) {
    
    this.amount = amount;
    this.currency = currency;
    this.orderId = orderId;
    this.description = description;
    this.email = email;
    this.setPreAuth(false);
    this.setRequiredRecToken(false);
    this.setVerificationType(Verification.AMOUNT);
    this.arguments = {};
  }

  setProductId = (productId : string) => {
    this.productId = productId;
  }

  setPaymentSystems = (paymentSystems : string) => {
    this.paymentSystems = paymentSystems;
  }

  setDefaultPaymentSystem = (defaultPaymentSystem : string) => {
    this.defaultPaymentSystem = defaultPaymentSystem;
  }

  setLifeTime = (lifeTime : Number) => {
    this.lifeTime = lifeTime;
  }

  setMerchantData = (merchantData : string) => {
    this.merchantData = merchantData;
  }

  setVersion = (version : string) => {
    this.version = version;
  }

  setServerCallbackUrl = (serverCallbackUrl : string) => {
    this.serverCallbackUrl = serverCallbackUrl;
  }

  setLang = (lang : Lang) => {
    this.lang = lang;
  }

  setPreAuth = (preAuth : Boolean) => {
    this.preAuth = preAuth;
  }

  setRequiredRecToken = (requiredRecToken : Boolean) => {
    this.requiredRecToken = requiredRecToken;
  }

  setVerification = (verification : Boolean) => {
    this.verification = verification;
  }

  setVerificationType = (verificationType : Verification) => {
    this.verificationType = verificationType;
  }

  setRecToken = (recToken : string) => {
    this.recToken = recToken;
  }

  addArgument = (name : string, value : string) => {
    this.arguments[name] = value;
  }
}

export class Card {
  __getCardNumber__ = () => {
  }
  __getExpYy__ = () => {
  }
  __getExpMm__ = () => {
  }
  __getCvv__ = () => {
  }

  __lunaCheck__ = (cardNumber) => {
    var sum = 0;
    var odd = true;
    for (var i = 0; i < cardNumber.length; i++) {
      try {
        var num = Number(cardNumber.charAt(i));
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
       
    return sum % 10 == 0;
  }
      
  isValidCardNumber = () => {
    let cardNumber = this.__getCardNumber__();
    if (!(12 <= cardNumber.length && cardNumber.length <= 19)) {
      return false;
    }
    if (!this.__lunaCheck__(cardNumber)) {
      return false;
    }
    return true;
  }
      
  __isValidExpireMonthValue__  = (mm) => {
    return mm >= 1 && mm <= 12;
  }
      
  isValidExpireMonth = () => {
    let mm = this.__getExpMm__();
    return this.__isValidExpireMonthValue__(mm);
  }
    
  __isValidExpireYearValue__ = (yy) => {
    return yy >= 17 && yy <= 99;
  }
    
  isValidExpireYear = () => {
    let yy = this.__getExpYy__();
    if (!this.__isValidExpireYearValue__(yy)) {
      return false;
    }
    let year = new Date().getFullYear() - 2000;
    return year <= yy;
  }
      
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
  }
      
  isValidCvv = () => {
    let cvv = this.__getCvv__();
    return cvv.length === 3;
  }
      
  isValidCard = () => {
    return this.isValidCardNumber() && this.isValidExpireDate() && this.isValidCvv();
  }
}

export class Receipt {
  maskedCard : string;
  cardBin : number;
  amount : number;
  paymentId : number;
  currency : Currency;
  status : string;
  transactionType : string;
  senderCellPhone : string;
  senderAccount : string;
  cardType : string;
  rrn : string;
  approvalCode : string;
  responseCode : string;
  productId : string;
  recToken : string;
  recTokenLifeTime : Date;
  reversalAmount : number;
  settlementAmount : number;
  settlementCurrency : Currency;
  settlementDate : Date;
  eci : number;
  fee : number;
  actualAmount : number;
  actualCurrency : string;
  paymentSystem : string;
  verificationStatus : string;
  signature : string;

  constructor(maskedCard : string,
              cardBin : number,
              amount : number,
              paymentId : number,
              currency : Currency,
              status : string,
              transactionType : string,
              senderCellPhone : string,
              senderAccount : string,
              cardType : string,
              rrn : string,
              approvalCode : string,
              responseCode : string,
              productId : string,
              recToken : string,
              recTokenLifeTime : Date,
              reversalAmount : number,
              settlementAmount : number,
              settlementCurrency : Currency,
              settlementDate : Date,
              eci : number,
              fee : number,
              actualAmount : number,
              actualCurrency : string,
              paymentSystem : string,
              verificationStatus : string,
              signature : string) {
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
  }

  static __fromOrderData__(orderData) {
    var recTokenLifeTime;
    try {
      recTokenLifeTime = Date.parse(orderData.rectoken_lifetime);
    } catch (e) {
      recTokenLifeTime = undefined;
    }
    var settlementCcy;
    try {
      settlementCcy = Currency[orderData.settlement_currency];
    } catch (e) {
      settlementCcy = undefined;
    }
    var settlementDate;
    try {
      recTokenLifeTime = Date.parse(orderData.rectoken_lifetime);
    } catch (e) {
      recTokenLifeTime = undefined;
    }
    var actualCcy;
    try {
      actualCcy = Currency[orderData.actual_currency];
    } catch (e) {
      actualCcy = undefined;
    }

    let receipt = new Receipt
      (
        orderData.masked_card,
        orderData.card_bin,
        Number(orderData.amount),
        orderData.payment_id,
        Currency[orderData.currency],
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
        settlementCcy,
        settlementDate,
        orderData.eci,
        orderData.fee,
        orderData.actual_amount,
        actualCcy,
        orderData.payment_system,
        orderData.verification_status,
        orderData.signature
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
    return 'Failure. '+super.toString()+', errorCode: '+this.errorCode+', requestId: '+this.requestId;
  }
}

export class Cloudipsp {
  constructor(merchantId : number = req('merchantId'), cloudipspView = req('cloudipspView')) {
    this.__merchantId__ = merchantId;
    this.__baseUrl__ = 'https://api.fondy.eu';
    this.__callbackUrl__ = 'http://callback';
    this.__cloudipspView__ = cloudipspView;
  }

  pay = (card : Card = req('card'), order : Order = req('order')) => {
    return this.__getToken__(order)
    .then((token) => {
      return this.__checkout__(token, card, order.email)
      .then((checkout) => {
        console.log('checkout: '+JSON.stringify(checkout));
        if (checkout.within_3ds === false) {
          return this.__receipt__(token);
        } else {
          var body;
          var contentType;
          let sendData = checkout.sendData;
          if (sendData.PaReq === '') {
            body = JSON.stringify(sendData);
            contentType = 'application/json';
          } else {
            body = 'MD='+encodeURIComponent(sendData.MD)+
                '&PaReq='+encodeURIComponent(sendData.PaReq)+
                '&TermUrl='+encodeURIComponent(sendData.TermUrl);
            contentType = 'application/x-www-form-urlencoded'
          }
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
            return response.text();
          })
          .then((html) => {
            return this.__cloudipspView__((cloudipspView) => {
              return cloudipspView.__confirm__(checkout.url, html);
            });
          });
        }
      });
    });
  }

  __getToken__ = (order : Order) => {
    let rqBody = {};
    rqBody.merchant_id = this.__merchantId__;
    rqBody.amount = String(order.amount);
    rqBody.currency = order.currency.code;
    rqBody.order_id = order.orderId;
    rqBody.order_desc = order.description;
    rqBody.email = order.email;
    rqBody.signature = 'button';
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

    return this.__apiCall__('/api/button', rqBody)
    .then((response) => {
      return response.checkout_url.split('token=')[1];
    });
  }
  
  __checkout__ = (token, card, email) => {
    buildExp = (mm, yy) => {
      return (mm<10?'0':'')+mm+yy;
    }
    
    let rqBody = {
      card_number : card.__getCardNumber__(),
      expiry_date : buildExp(card.__getExpMm__() , card.__getExpYy__()),
      cvv2 : card.__getCvv__(),
      token : token,
      email : email,
      payment_system : 'card'
    };
    
    return this.__apiCall__('/api/checkout/ajax', rqBody)
    .then((response) => {
      if (response.url == this.__callbackUrl__) {
        return {within_3ds:false};
      } else {
        return {within_3ds:true, url : response.url, sendData: response.send_data};
      }
    });
  }
  
  __receipt__ = (token) => {
    return this.__apiCall__('/api/checkout/merchant/order', {token:token})
    .then((response) => {
      return Receipt.__fromOrderData__(response.order_data);
    });
  }
  
  __apiCall__ = (path : string, request : any) => {
    return this.__call__(this.__baseUrl__+path, request);
  }
  
  __call__ = (url : string, request : any) => {
    let body = JSON.stringify({request:request});
    console.log('POST '+url+' ' + body);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'React-Native'
      },
      body: body
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log('json: '+JSON.stringify(json));
      let response = json.response;
      if (response.response_status == 'success') {
        return response;
      } else {
        throw new Failure(response.error_message, response.error_code, response.request_id);
      }
    });
    
    stat
  }
}