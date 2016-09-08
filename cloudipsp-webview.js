import React, { Component } from 'react';
import {View, WebView} from 'react-native';
import {Receipt} from './cloudipsp'

export class CloudipspWebView extends Component {
  constructor(props) {
    super(props);
    this.state={};
    this.urlStartPattern = 'http://secure-redirect.cloudipsp.com/submit/#';
  }
  
  __confirm__ = (baseUrl, html) => {
    if (this.onSuccess !== undefined) {
      throw new Error('CloudipspWebView already waiting for confirmation');
    }
    let state = {baseUrl : baseUrl, html : html};
    console.log('state at web view: '+JSON.stringify(state));
    this.setState(state);
    return new Promise((onOk, onNotOk) => {
      this.onSuccess = onOk;
    });
  }
  
  render() {
    if (this.state.baseUrl === undefined) {
      return (<View />);
    } else {
      return  (
        <WebView
          style={{flex:1}} 
          ref='webView'
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          source={{ baseUrl : this.state.baseUrl, html : this.state.html}}
          onLoadStart={(event) => {
            if (this.onSuccess !== undefined) {
              let url = event.nativeEvent.url;
              if (url.startsWith(this.urlStartPattern)) {
                let jsonOfConfirmation = url.split(this.urlStartPattern)[1];
                console.log('json of confirmation: '+jsonOfConfirmation);
                var response;
                try {
                  response = JSON.parse(jsonOfConfirmation);
                } catch (e) {
                  response = JSON.parse(decodeURIComponent(jsonOfConfirmation));
                }
                let receipt = Receipt.__fromOrderData__(response.params);
                this.setState({baseUrl : undefined, html : undefined}, () => {
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