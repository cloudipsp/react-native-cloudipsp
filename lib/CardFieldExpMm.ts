import {CardFieldBase} from './CardFieldBase';


function getSelfName() {
  return 'CardFieldExpMm';
}

export class CardFieldExpMm extends CardFieldBase {
  public static readonly getInputName = getSelfName;
  protected readonly _selfName = getSelfName;

  protected _maxLength(): number {
    return 2;
  }
}
