import React from 'react';
import {
    TextInput
} from 'react-native';

export default class CardFieldBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {__text__: ''};
    }

    _setText = (text) => {
        this.setState({__text__: text});
    }

    _getText = () => {
        return this.state.__text__;
    }

    _maxLength() {
        throw new Error('not implemented');
    }

    _isSecure() {
        return false;
    }

    focus() {
        this.refs.input.focus();
    }

    render() {
        return (<TextInput
            ref='input'

            {...this.props}

            maxLength={this._maxLength()}
            secureTextEntry={this._isSecure()}
            multiline={false}
            keyboardType={'numeric'}

            value={this.state.__text__}
            onChangeText={(text) => {
                this.setState({__text__:text});
            }}
        />);
    }
}
