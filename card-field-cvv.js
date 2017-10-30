import React from 'react';

import CardFieldBase from './card-field-base';


function getSelfName() {
    return 'CardFieldCvv';
}

export default class CardFieldCvv extends CardFieldBase {
    constructor(props) {
        super(props);
            
	    this._selfName = getSelfName;
    }

    _maxLength() {
        return 4;
    }

    _isSecure() {
        return true;
    }
}

CardFieldCvv.getInputName = getSelfName;