import React from 'react';

import CardFieldBase from './card-field-base';

export default class CardFieldExpYy extends CardFieldBase {
    constructor(props) {
        super(props);
    }

    _maxLength() {
        return 2;
    }
}

CardFieldExpYy.getInputName = function() {
    return 'CardFieldExpYy';
}