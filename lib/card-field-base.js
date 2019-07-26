import React from 'react';
import { TextInput } from 'react-native';


export default class CardFieldBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { __text__: '', __enabled__: true, __max_length__: this._maxLength() };
  }

  _setEnable = (value) => {
    this.setState({ __enabled__: value });
  };

  _setText = (text) => {
    this.setState({ __text__: text });
  };

  _getText = () => {
    return this.state.__text__;
  };

  _setMaxLength = (value) => {
    this.setState({ __max_length__: value });
  };

  _isSecure() {
    return false;
  }

  _maxLength() {
    throw new Error('not implemented');
  }

  focus() {
    this.refs.input.focus();
  }

  render() {
    return (<TextInput
      ref='input'

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
