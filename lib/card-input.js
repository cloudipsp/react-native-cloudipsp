import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CardLayout from './card-layout';
import CardInputNumber from './card-field-number';
import CardInputExpMm from './card-field-exp-mm';
import CardInputExpYy from './card-field-exp-yy';
import CardInputCvv from './card-field-cvv';


export class CardInput extends React.Component {
  constructor(props) {
    super(props);
  }

  getCard = () => {
    return this.cardLayout.getCard();
  };

  showCard = (card) => {
    this.cardLayout.showCard(card);
  };

  test = () => {
    this.cardLayout.test();
  };

  focus = () => {
    this.inputNumber.focus();
  };

  render() {
    return (
      <CardLayout
        ref={(ref) => {
          this.cardLayout = ref
        }}
        inputNumber={() => this.inputNumber}
        inputExpMm={() => this.inputMm}
        inputExpYy={() => this.inputYy}
        inputCvv={() => this.inputCvv}
      >
        <Text
          style={this.props.textStyle}
          onPress={this.props.debug ? this.test : undefined}>
          Card Number:
        </Text>
        <CardInputNumber
          ref={(ref) => {
            this.inputNumber = ref
          }}
          onSubmitEditing={() => {
            this.inputMm.focus();
          }}
          style={this.props.textInputStyle}
        />
        <Text style={this.props.textStyle}>Expiry:</Text>
        <View style={styles.row}>
          <CardInputExpMm
            ref={(ref) => {
              this.inputMm = ref
            }}
            placeholder='MM'
            onSubmitEditing={() => {
              this.inputYy.focus();
            }}
            style={[styles.flex1, this.props.textInputStyle]}
          />
          <CardInputExpYy
            ref={(ref) => {
              this.inputYy = ref
            }}
            placeholder='YY'
            onSubmitEditing={() => {
              this.inputCvv.focus();
            }}
            style={[styles.flex1, this.props.textInputStyle]}/>
        </View>
        <Text style={this.props.textStyle}>CVV:</Text>
        <CardInputCvv
          ref={(ref) => {
            this.inputCvv = ref
          }}
          onSubmitEditing={() => {
            if (this.props.onCompletion) {
              this.props.onCompletion(this);
            }
          }}
          style={this.props.textInputStyle}
        />
      </CardLayout>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  flex1: {
    flex: 1
  }
});
