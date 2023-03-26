import {Currency} from './Currency';
import {Lang} from './Lang';
import {req} from './req';
import {Verification} from './Verification';

export class Order {
  public amount: number;
  public currency: string;
  public orderId: string;
  public description: string;
  public email: string;

  private readonly _arguments: {[key: string]: string} = {};

  private _productId?: string;
  private _paymentSystems?: string;
  private _defaultPaymentSystem?: string;
  private _lifeTime?: number;
  private _merchantData?: string;
  private _version?: string;
  private _serverCallbackUrl?: string;
  private _lang?: Lang;
  private _preAuth?: boolean;
  private _requiredRecToken?: boolean;
  private _verification?: boolean;
  private _verificationType?: Verification;
  private _recToken?: string;
  private _delayed?: boolean;

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
    this.setDelayed(false);
  }

  setProductId(productId: string): void {
    this._productId = productId;
  }

  setPaymentSystems(paymentSystems: string): void {
    this._paymentSystems = paymentSystems;
  }

  setDefaultPaymentSystem(defaultPaymentSystem: string): void {
    this._defaultPaymentSystem = defaultPaymentSystem;
  }

  setLifeTime(lifeTime: number): void {
    this._lifeTime = lifeTime;
  }

  setMerchantData(merchantData: string): void {
    this._merchantData = merchantData;
  }

  setVersion(version: string): void {
    this._version = version;
  }

  setServerCallbackUrl(serverCallbackUrl: string): void {
    this._serverCallbackUrl = serverCallbackUrl;
  }

  setLang(lang: Lang): void {
    this._lang = lang;
  }

  setPreAuth(preAuth: boolean): void {
    this._preAuth = preAuth;
  }

  setRequiredRecToken(requiredRecToken: boolean): void {
    this._requiredRecToken = requiredRecToken;
  }

  setVerification(verification: boolean): void {
    this._verification = verification;
  }

  setVerificationType(verificationType: Verification): void {
    this._verificationType = verificationType;
  }

  setRecToken(recToken: string): void {
    this._recToken = recToken;
  }

  setDelayed(delayed: boolean): void {
    this._delayed = delayed;
  }

  addArgument(name: string, value: string): void {
    this._arguments[name] = value;
  }
}

export interface OrderPrivate {
  readonly _arguments: {[key: string]: string};

  readonly _productId?: string;
  readonly _paymentSystems?: string;
  readonly _defaultPaymentSystem?: string;
  readonly _lifeTime?: number;
  readonly _merchantData?: string;
  readonly _version?: string;
  readonly _serverCallbackUrl?: string;
  readonly _lang?: Lang;
  readonly _preAuth?: boolean;
  readonly _requiredRecToken?: boolean;
  readonly _verification?: boolean;
  readonly _verificationType?: Verification;
  readonly _recToken?: string;
  readonly _delayed?: boolean;
}
