import CardFieldBase from './card-field-base';


function getSelfName() {
  return 'CardFieldExpYy';
}

export default class CardFieldExpYy extends CardFieldBase {
  constructor(props) {
    super(props);
    this._selfName = getSelfName;
  }

  _maxLength() {
    return 2;
  }
}

CardFieldExpYy.getInputName = getSelfName;
