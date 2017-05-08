/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  ScrollView,
  Text,
  TextInput,
  View,
  Picker,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import {
  Currency,
  Order,
  Receipt,
  Failure,
  Cloudipsp,
  CardInput,
  CloudipspWebView
} from 'react-native-cloudipsp';

class cloudipsp extends Component {
  constructor(props) {
    super(props);

    this.state = {amount:'1',ccy:'uah',email:'example@test.com',description:'test payment :)'};
  }

  test = () => {
    this.setState({amount:'1', ccy:'UAH', email:'valik.beregovoy@gmail.com', description:'test :)'}, () => {
      this.pay();
    });
    this.refs.cardInput.test();
  }

  pay = () => {
    let cloudipsp = new Cloudipsp(1000, (payConfirmator) => {
        this.setState({webView : 1});
        return payConfirmator(this.refs.cloudipspWebView);
      });
    
    
    let order = new Order(Number(this.state.amount), Currency[this.state.ccy], 'rn_'+Math.random(), this.state.description, this.state.email);
    let card = this.refs.cardInput.getCard();
    
    console.log('this: '+JSON.stringify(card));
    if (!card.isValidCardNumber()) {
      Alert.alert('Warning', 'Credit card number is not valid');
    } else if (!card.isValidExpireMonth()) {
      Alert.alert('Warning', 'Expire month is not valid');
    } else if (!card.isValidExpireYear()) {
      Alert.alert('Warning', 'Expire year is not valid');
    } else if (!card.isValidExpireDate()) {
      Alert.alert('Warning', 'Expire date is not valid');
    } else if (!card.isValidCvv()) {
      Alert.alert('Warning', 'CVV is not valid');
    } else {
      cloudipsp.pay(card, order)
      .then((receipt) => {
        this.setState({webView:undefined});
        Alert.alert('Transaction Completed :)', 'Result: '+ receipt.status + '\nPaymentId: ' + receipt.paymentId);
        console.log('receipt: '+JSON.stringify(receipt));
      })
      .catch((error) => {
        console.log('error: '+error);
      });
    }
  }

  render() {
    if (this.state.webView !== undefined) {
      return (
        <CloudipspWebView
          ref="cloudipspWebView"
          decelerationRate="normal"
          onError={(error) => {
            console.log('webViewError:'+ JSON.stringify(error)) ;}}
          style={{flex:1}} />
      );
    } else {
      return (
      <ScrollView style={{flex: 1}}>
        <View
          style={{padding:20, flex: 1}}>
          <TouchableOpacity onPress={this.test}>
            <Text style={styles.simpleText}>Amount:</Text>
          </TouchableOpacity>
          <TextInput
            value={this.state.amount}
            maxLength = {7}
            keyboardType='numeric'
            onChangeText={(text) =>
              this.setState({amount:text})}
            onSubmitEditing={(event) => {
              this.refs.inputEmail.focus();
            }}
            style={styles.simpleTextInput}
          />
          <Text style={styles.simpleText}>Currency:</Text>
          <Picker
            selectedValue={this.state.ccy}
            onValueChange={(value) => this.setState({ccy:value})}>
            <Picker.Item label="UAH" value="UAH"/>
            <Picker.Item label="USD" value="USD"/>
            <Picker.Item label="EUR" value="EUR"/>
            <Picker.Item label="GBP" value="GBP"/>
            <Picker.Item label="RUR" value="RUR"/>
          </Picker>
          <Text style={styles.simpleText}>Email:</Text>
          <TextInput
            ref="inputEmail"
            value={this.state.email}
            keyboardType='email-address'
            onChangeText={(text) =>
              this.setState({email:text})}
            onSubmitEditing={(event) => {
              this.refs.inputDescription.focus();
            }}
            style={styles.simpleTextInput}
          />
          <Text style={styles.simpleText}>Description:</Text>
          <TextInput
            ref="inputDescription"
            value={this.state.description}
            onChangeText={(text) =>
              this.setState({description:text})}
            onSubmitEditing={(event) => {
              this.refs.cardInput.focus();
            }}
            style={styles.simpleTextInput}
          />
          <CardInput 
            ref="cardInput"
            debug={true} 
            textStyle={styles.simpleText}
            textInputStyle={styles.simpleTextInput}/>
          <TouchableOpacity onPress={this.pay}>
            <Text style={{textAlign:'center', marginTop : 12, borderWidth: 1, borderColor: '#999999',}}>Pay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
    }
  }
}

var styles = StyleSheet.create({
  simpleTextInput: {
    height: 33,
    borderWidth: 0.5,
    borderColor: '#9900ff',
    flex: 1,
    fontSize: 17,
    padding: 6,
  },
  simpleText: {
    color: '#ff9900',
    fontSize: 16,
    padding: 4,
    marginTop : 5,
    marginBottom : 5
  }
});

AppRegistry.registerComponent('cloudipsp', () => cloudipsp);
