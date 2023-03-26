import {NativeModules} from 'react-native';

export interface INativeAndroid {
  addCookies(host: string, cookie: string): void;
  supportsGooglePay(): Promise<boolean>;
  googlePay(config: unknown): Promise<unknown>;
}

export interface INativeIOS {
  supportsApplePay(): Promise<boolean>;
  applePay(
    config: unknown,
    amount: number,
    currency: string,
    about: string,
  ): Promise<unknown>;
  applePayComplete(success: boolean): Promise<void>;
}

export interface INative extends INativeAndroid, INativeIOS {}

export const Native = NativeModules.RNCloudipsp as INative;

if (!Native) {
  throw new Error(
    'Cloudipsp native module not found. Did you forget to link native module or rebuild the native project after installing this library?'
  )
}
