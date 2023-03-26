import React from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

import {Receipt} from './models'
import {Native} from './Native';
import {WebViewNavigationEvent} from "react-native-webview/lib/WebViewTypes";


const addViewportMeta = `(${String(() => {
// @ts-ignore
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, user-scalable=0,');
  meta.setAttribute('name', 'viewport');
// @ts-ignore
  const elementHead = document.getElementsByTagName('head');
  if (elementHead) {
    elementHead[0].appendChild(meta);
  } else {
// @ts-ignore
    const head = document.createElement('head');
    head.appendChild(meta);
  }
})})();`;

type Props = {

};


type State = {
  baseUrl: undefined;
} | {
  baseUrl: string;
  html: string;
  cookies: string | null;
  apiHost: string;
  callbackUrl: string;
};

export class CloudipspWebView extends React.Component<Props, State> {
  state: State = {
    baseUrl: undefined,
  };

  private readonly _urlStartPattern = 'http://secure-redirect.cloudipsp.com/submit/#'
  private readonly _webViewRef = React.createRef<WebView>();
  private _onSuccess?: (receipt: Receipt) => void;
  private _onFailure?: () => void;

  private readonly __confirm__ = (
    baseUrl: string,
    html: string,
    cookies: string | null,
    apiHost: string,
    callbackUrl: string,
  ): Promise<Receipt> => {
    if (this._onSuccess) {
      throw new Error('CloudipspWebView already waiting for confirmation');
    }
    if (cookies && Platform.OS === 'android') {
      Native.addCookies(baseUrl, cookies);
    }

    this.setState({ baseUrl, html, cookies, apiHost, callbackUrl });
    return new Promise((resolve, reject) => {
      this._onSuccess = resolve;
      this._onFailure = reject;
    });
  };

  private readonly _onLoadStart = (event: WebViewNavigationEvent) => {
    if (!this._onSuccess) {
      return;
    }
    if (!this.state.baseUrl) {
      return;
    }
    const {apiHost, callbackUrl} = this.state;
    const url = event.nativeEvent.url;
    const detectsStartPattern = url.startsWith(this._urlStartPattern);
    let detectsCallbackUrl = false;
    let detectsApiToken = false;
    if (!detectsStartPattern) {
      detectsCallbackUrl = url.startsWith(callbackUrl);
      if (!detectsCallbackUrl) {
        detectsApiToken = url.startsWith(`${apiHost}/api/checkout?token=`);
      }
    }

    if (detectsStartPattern || detectsCallbackUrl || detectsApiToken) {
      let receipt: Receipt;
      if (detectsStartPattern) {
        let jsonOfConfirmation = url.split(this._urlStartPattern)[1];
        let response;
        try {
          response = JSON.parse(jsonOfConfirmation);
        } catch (e) {
          response = JSON.parse(decodeURIComponent(jsonOfConfirmation));
        }
        receipt = Receipt.__fromOrderData__(response.params);
      }
      this.setState({ baseUrl: undefined, html: undefined, cookies: undefined }, () => {
        this._onSuccess!(receipt);
        this._onSuccess = undefined;
      });
      this._webViewRef.current?.goBack();
    }
  };

  render(): React.ReactNode {
    if (this.state.baseUrl === undefined) {
      return (<View/>);
    } else {
      const {baseUrl, html} = this.state;

      return (
        <WebView
          style={{ flex: 1 }}
          ref={this._webViewRef}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          source={{ baseUrl, html }}
          injectedJavaScript={addViewportMeta}
          onLoadStart={this._onLoadStart}
        />
      );
    }
  }
}

export type CloudipspWebviewProvider = (callback: (webView: CloudipspWebView) => void) => void;
export interface CloudipspWebviewPrivate {
  __confirm__(
    baseUrl: string,
    html: string,
    cookies: string | null,
    apiHost: string,
    callbackUrl: string,
  ): Promise<Receipt>
};
