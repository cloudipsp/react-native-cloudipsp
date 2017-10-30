import React from 'react';

import CardFieldBase from './card-field-base';

function getSelfName() {
    return 'CardFieldNumber';
}

export default class CardFieldNumber extends CardFieldBase {
    constructor(props) {
        super(props);
        this._selfName = getSelfName;
    }

    _maxLength() {
        return 19;
    }
}

CardFieldNumber.getInputName = getSelfName;