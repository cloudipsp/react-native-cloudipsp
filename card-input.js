import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  TextInput,
  Dimensions,
  ToastAndroid
} from 'react-native';

import { Card } from './cloudipsp'

export class CardInput extends Component {
  constructor(props) {
    super(props);
    this.state = {__number__:'',__exp_mm__:'',__exp_yy__:'',__cvv__:''};
  }
  
  getCard = () => {
    let s = this.state;
    let card = new Card();
    card.__getCardNumber__ = () => {
      return s.__number__;
    };
    card.__getExpYy__ = () => {
      try {
        return Number(s.__exp_yy__);
      } catch (e) {
        return 0;
      }
    };
    card.__getExpMm__ = () => {
      try {
        return Number(s.__exp_mm__);
      } catch (e) {
        return 0;
      }
    };
    card.__getCvv__ = () => {
      return s.__cvv__;
    };
    
    return card;
  }
  
  test = () => {
    this.setState({__number__:'4444555566661111',__exp_mm__:'12',__exp_yy__:'18',__cvv__:'111'});
  }
  
  focus = () => {
    this.refs.inputNumber.focus();
  }
  
  render() {
    return  (
        <View>
          <Text
            style={this.props.textStyle}
            onPress={this.props.debug?this.test:undefined}>Card Number:</Text>
          <TextInput 
            ref="inputNumber"
            value={this.state.__number__}
            maxLength = {19}
            onChangeText={(text) => 
              this.setState({__number__:text})}
            onSubmitEditing={(event) => { 
              this.refs.inputMm.focus(); 
            }}
            keyboardType='numeric'
            style={this.props.textInputStyle}/>
          <Text style={this.props.textStyle}>Expiry:</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput 
              ref="inputMm"
              value={this.state.__exp_mm__}
              style={{flex: 1}} 
              placeholder='MM'
              maxLength = {2}
              onChangeText={(text) => 
                this.setState({__exp_mm__:text})}
              onSubmitEditing={(event) => { 
                    this.refs.inputYy.focus(); 
              }}
              keyboardType='numeric'
              style={this.props.textInputStyle}/>
            <TextInput 
              ref="inputYy"
              value={this.state.__exp_yy__}
              style={{flex: 1}} 
              placeholder='YY' 
              maxLength = {2}
              onChangeText={(text) => 
                this.setState({__exp_yy__:text})}
              onSubmitEditing={(event) => { 
                this.refs.inputCvv.focus(); 
              }}
              keyboardType='numeric'
              style={this.props.textInputStyle}/>
          </View>
          <Text style={this.props.textStyle}>CVV:</Text>
          <TextInput 
            ref="inputCvv"
            value={this.state.__cvv__}
            maxLength = {3}
            onChangeText={(text) => 
              this.setState({__cvv__:text})}
            keyboardType='numeric'
            style={this.props.textInputStyle}/>
        </View>
    );
  }
}
