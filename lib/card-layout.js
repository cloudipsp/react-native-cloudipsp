import React from 'react';
import { View } from 'react-native';

import { Card } from './cloudipsp';

import CardInputNumber from './card-field-number';
import CardInputExpMm from './card-field-exp-mm';
import CardInputExpYy from './card-field-exp-yy';
import CardInputCvv from './card-field-cvv';
import { isCvv4Length } from './cvv-utils';


export default class CardLayout extends React.Component {
  constructor(props) {
    super(props);

    if (!props.inputNumber || typeof props.inputNumber !== 'function') {
      throw new Error('inputNumber prop is required');
    }
    if (!props.inputExpMm || typeof props.inputExpMm !== 'function') {
      throw new Error('inputExpMm prop is required');
    }
    if (!props.inputExpYy || typeof props.inputExpYy !== 'function') {
      throw new Error('inputExpYy prop is required');
    }
    if (!props.inputCvv || typeof props.inputCvv !== 'function') {
      throw new Error('inputCvv prop is required');
    }

    this.displayedCard = undefined;
  }

  getCard = () => {
    if (this.displayedCard) {
      return null;
    }

    const cardNumber = this.inputNumber._getText();
    const expMm = this.inputExpMm._getText();
    const expYy = this.inputExpYy._getText();
    const expCvv = this.inputCvv._getText();

    const card = new Card();
    card.__getCardNumber__ = () => {
      return cardNumber;
    };
    card.__getExpYy__ = () => {
      try {
        return Number(expYy);
      } catch (e) {
        return 0;
      }
    };
    card.__getExpMm__ = () => {
      try {
        return Number(expMm);
      } catch (e) {
        return 0;
      }
    };
    card.__getCvv__ = () => {
      return expCvv;
    };

    return card;
  };

  showCard = (card) => {
    let enabled = true;
    if (card) {
      this.inputNumber._setText(card.__getCardNumber__());
      this.inputExpMm._setText(String(card.__getExpYy__()));
      this.inputExpYy._setText(String(card.__getCardNumber__()));
      this.displayedCard = card;
    } else {
      enabled = false;
      this.inputNumber._setText('');
      this.inputExpMm._setText('');
      this.inputExpYy._setText('');
      this.displayedCard = undefined;
    }
    this.inputCvv._setText('');
    this.inputNumber._setEnable(enabled);
    this.inputExpMm._setEnable(enabled);
    this.inputExpYy._setEnable(enabled);
    this.inputCvv._setEnable(enabled);
  };

  test = () => {
    this.inputNumber._setText('4444555566661111');
    this.inputExpMm._setText('12');
    this.inputExpYy._setText('20');
    this.inputCvv._setText('111');
  };

  componentDidMount() {
    this._pullInput('inputNumber', CardInputNumber);
    this._pullInput('inputExpMm', CardInputExpMm);
    this._pullInput('inputExpYy', CardInputExpYy);
    this._pullInput('inputCvv', CardInputCvv);

    this.inputNumber.__onChangeText__ = (text) => {
      this.inputCvv._setCvv4(isCvv4Length(text));
    };
  }

  render() {
    return (
      <View style={this.props.containerStyle}>
        {this.props.children}
      </View>);
  }

  _pullInput = (input, component) => {
    let instance = this.props[input]();
    if (!instance) {
      throw new Error('Missed result value for "' + input + '"');
    }
    if (!instance._selfName) {
      throw new Error('Invalid component for "' + input + '"');
    }
    let selfName = instance._selfName();
    if (!selfName) {
      throw new Error('Missed result value for "' + input + '"');
    }
    let componentName = component.getInputName();
    if (componentName !== selfName) {
      throw new Error('Unexpected component "' + selfName + '" was set at "' + componentName + '" place');
    }
    this[input] = instance;
  }
}
