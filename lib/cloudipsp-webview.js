import React from 'react';
import { View, WebView } from 'react-native';

import { Receipt } from './cloudipsp'


const addViewportMeta = `(${String(() => {
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, user-scalable=0,');
  meta.setAttribute('name', 'viewport');
  const elementHead = document.getElementsByTagName('head');
  if (elementHead) {
    elementHead[0].appendChild(meta);
  } else {
    const head = document.createElement('head');
    head.appendChild(meta);
  }
})})();`;

export class CloudipspWebView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.urlStartPattern = 'http://secure-redirect.cloudipsp.com/submit/#';
  }

  __confirm__ = (baseUrl, html, apiHost, callbackUrl) => {
    if (this.onSuccess !== undefined) {
      throw new Error('CloudipspWebView already waiting for confirmation');
    }
    this.setState({ baseUrl, html, apiHost, callbackUrl });
    return new Promise((resolve, reject) => {
      this.onSuccess = resolve;
      this.onFailure = reject;
    });
  };

  render() {
    if (this.state.baseUrl === undefined) {
      return (<View/>);
    } else {
      return (
        <WebView
          style={{ flex: 1 }}
          ref='webView'
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          source={{ baseUrl: this.state.baseUrl, html: this.state.html }}
          injectedJavaScript={addViewportMeta}
          onLoadStart={(event) => {
            if (this.onSuccess !== undefined) {
              const url = event.nativeEvent.url;
              const detectsStartPattern = url.startsWith(this.urlStartPattern);
              let detectsCallbackUrl = false;
              let detectsApiToken = false;
              if (!detectsStartPattern) {
                detectsCallbackUrl = url.startsWith(this.state.callbackUrl);
                if (!detectsCallbackUrl) {
                  detectsApiToken = url.startsWith(`${this.state.apiHost}/api?token=`);
                }
              }


              if (detectsStartPattern || detectsCallbackUrl || detectsApiToken) {
                let receipt = null;
                if (detectsStartPattern) {
                  let jsonOfConfirmation = url.split(this.urlStartPattern)[1];
                  let response;
                  try {
                    response = JSON.parse(jsonOfConfirmation);
                  } catch (e) {
                    response = JSON.parse(decodeURIComponent(jsonOfConfirmation));
                  }
                  receipt = Receipt.__fromOrderData__(response.params);
                }
                this.setState({ baseUrl: undefined, html: undefined }, () => {
                  this.onSuccess(receipt);
                  this.onSuccess = undefined;
                });
                this.refs.webView.goBack();
              }
            }
          }}
        />
      );
    }
  }
}
