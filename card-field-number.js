import React from 'react';

import CardFieldBase from './card-field-base';

export default class CardFieldNumber extends CardFieldBase {
    constructor(props) {
        super(props);
    }

    _maxLength() {
        return 19;
    }
}

CardFieldNumber.getInputName = function() {
    return 'CardFieldNumber';
}