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
    return 3;
  }

  _isSecure() {
    return true;
  }

  _setCvv4(enabled) {
    this._setMaxLength(enabled ? 4 : 3);
    if (!enabled) {
      const cvv = this._getText();
      if (cvv.length === 4) {
        this._setText(cvv.substr(0, 3));
      }
    }
  }
}

CardFieldCvv.getInputName = getSelfName;
