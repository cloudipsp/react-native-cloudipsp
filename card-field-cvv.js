import React from 'react';

import CardFieldBase from './card-field-base';

export default class CardFieldCvv extends CardFieldBase {
    constructor(props) {
        super(props);
    }

    _maxLength() {
        return 4;
    }

    _isSecure() {
        return true;
    }
}

CardFieldCvv.getInputName = function() {
    return 'CardFieldCvv';
}