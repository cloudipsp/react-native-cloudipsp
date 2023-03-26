import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

export type CloudipspInputProps = TextInputProps

type State = {
  __text__: string;
  __enabled__: boolean;
  __max_length__: number;
}

export abstract class CardFieldBase extends React.Component<CloudipspInputProps, State> {
  public static readonly getInputName: () => string;

  state: State = {
    __text__: '',
    __enabled__: true,
    __max_length__: this._maxLength(),
  };
  private readonly _inputRef = React.createRef<TextInput>();
  private __onChangeText__?: (text: string) => void;

  private readonly _setEnable = (value: boolean): void => {
    this.setState({ __enabled__: value });
  };

  protected readonly _setText = (text: string): void => {
    this.setState({ __text__: text });
  };

  protected readonly _getText = (): string => {
    return this.state.__text__;
  };

  protected readonly _setMaxLength = (value: number): void => {
    this.setState({ __max_length__: value });
  };

  protected _isSecure(): boolean {
    return false;
  }

  protected _selfName(): string {
    throw new Error('not implemented');
  }

  protected _maxLength(): number {
    throw new Error('not implemented');
  }

  focus() {
    this._inputRef.current?.focus();
  }

  render() {
    return (<TextInput
      ref={this._inputRef}

      {...this.props}

      maxLength={this.state.__max_length__}
      secureTextEntry={this._isSecure()}
      multiline={false}
      editable={this.state.__enabled__}
      keyboardType={'numeric'}

      value={this.state.__text__}
      onChangeText={(text) => {
        if (this.__onChangeText__) {
          this.__onChangeText__(text);
        }
        this.setState({ __text__: text });
      }}
    />);
  }
}


export interface CardFieldBasePrivate {
  _selfName(): string;
  __onChangeText__?: (text: string) => void;
  _setEnable(value: boolean): void;
  _setText(text: string): void;
  _getText(): string;
  _setMaxLength(value: number): void;
}
