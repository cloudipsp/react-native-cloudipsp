import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import { Card, CardPrivate } from './models';

import {CardFieldBase, CardFieldBasePrivate} from './CardFieldBase';
import {CardFieldNumber} from './CardFieldNumber';
import {CardFieldExpMm} from './CardFieldExpMm';
import {CardFieldExpYy} from './CardFieldExpYy';
import {CardFieldCvv, CardFieldCvvPrivate} from './CardFieldCvv';
import {isCvv4Length} from './CvvUtils';

type Props = {
  children: React.ReactNode;

  inputNumber: () => CardFieldNumber;
  inputExpMm: () => CardFieldExpMm;
  inputExpYy: () => CardFieldExpYy;
  inputCvv: () => CardFieldCvv;

  containerStyle?: StyleProp<ViewStyle>;
};

type Input = 'inputNumber' | 'inputExpMm' | 'inputExpYy' | 'inputCvv';


export class CardLayout extends React.Component<Props> {
  private _inputNumber!: CardFieldBasePrivate;
  private _inputExpMm!: CardFieldBasePrivate;
  private _inputExpYy!: CardFieldBasePrivate;
  private _inputCvv!: CardFieldCvvPrivate;
  private _displayedCard?: CardPrivate;

  constructor(props: Props) {
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

    this._displayedCard = undefined;
  }

  public readonly getCard = (): Card | null => {
    if (this._displayedCard) {
      return null;
    }

    const cardNumber = this._inputNumber._getText();
    const expMm = this._inputExpMm._getText();
    const expYy = this._inputExpYy._getText();
    const expCvv = this._inputCvv._getText();

    const card = new Card();
    const cardPrivate = card as unknown as CardPrivate;
    cardPrivate.__getCardNumber__ = () => {
      return cardNumber;
    };
    cardPrivate.__getExpYy__ = () => {
      try {
        return Number(expYy);
      } catch (e) {
        return 0;
      }
    };
    cardPrivate.__getExpMm__ = () => {
      try {
        return Number(expMm);
      } catch (e) {
        return 0;
      }
    };
    cardPrivate.__getCvv__ = () => {
      return expCvv;
    };

    return card;
  };

  public readonly showCard = (card: Card): void => {
    let enabled = true;
    if (card) {
      if (!(card instanceof Card)) {
        throw new Error('Invalid card to show');
      }

      const cardPrivate = card as unknown as CardPrivate;

      this._inputNumber._setText(cardPrivate.__getCardNumber__());
      this._inputExpMm._setText(String(cardPrivate.__getExpYy__()));
      this._inputExpYy._setText(String(cardPrivate.__getCardNumber__()));
      this._displayedCard = cardPrivate;
    } else {
      enabled = false;
      this._inputNumber._setText('');
      this._inputExpMm._setText('');
      this._inputExpYy._setText('');
      this._displayedCard = undefined;
    }
    this._inputCvv._setText('');
    this._inputNumber._setEnable(enabled);
    this._inputExpMm._setEnable(enabled);
    this._inputExpYy._setEnable(enabled);
    this._inputCvv._setEnable(enabled);
  };

  public readonly test = (): void => {
    this._inputNumber._setText('4444555566661111');
    this._inputExpMm._setText('12');
    this._inputExpYy._setText('25');
    this._inputCvv._setText('111');
  };

  componentDidMount(): void {
    this._inputNumber = this._pullInput('inputNumber', CardFieldNumber);
    this._inputExpMm = this._pullInput('inputExpMm', CardFieldExpMm);
    this._inputExpYy = this._pullInput('inputExpYy', CardFieldExpYy);
    this._inputCvv = this._pullInput('inputCvv', CardFieldCvv);

    this._inputNumber.__onChangeText__ = (text: string) => {
      this._inputCvv._setCvv4(isCvv4Length(text));
    };
  }

  render(): React.ReactNode {
    return (
      <View style={this.props.containerStyle}>
        {this.props.children}
      </View>);
  }

  private readonly _pullInput = <T extends CardFieldBasePrivate, C extends typeof CardFieldBase>(
    input: Input,
    component: C,
  ): T => {
    const instance = this.props[input]();
    if (!instance) {
      throw new Error('Missed result value for "' + input + '"');
    }
    const instancePrivate = instance as unknown as CardFieldBasePrivate;
    if (!instancePrivate._selfName) {
      throw new Error('Invalid component for "' + input + '"');
    }
    let selfName = instancePrivate._selfName();
    if (!selfName) {
      throw new Error('Missed result value for "' + input + '"');
    }
    let componentName = component.getInputName();
    if (componentName !== selfName) {
      throw new Error('Unexpected component "' + selfName + '" was set at "' + componentName + '" place');
    }
    return instancePrivate as unknown as T;
  }
}
