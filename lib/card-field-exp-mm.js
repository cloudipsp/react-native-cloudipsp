import CardFieldBase from './card-field-base';


function getSelfName() {
  return 'CardFieldExpMm';
}

export default class CardFieldExpMm extends CardFieldBase {
  constructor(props) {
    super(props);
    this._selfName = getSelfName;
  }

  _maxLength() {
    return 2;
  }
}

CardFieldExpMm.getInputName = getSelfName;
