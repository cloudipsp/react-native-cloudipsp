import React from 'react';

import CardFieldBase from './card-field-base';

export default class CardFieldExpMm extends CardFieldBase {
    constructor(props) {
        super(props);
    }

    _maxLength() {
        return 2;
    }
}

CardFieldExpMm.getInputName = function() {
    return 'CardFieldExpMm';
}