import {CardFieldBase} from './CardFieldBase';


function getSelfName() {
  return 'CardFieldExpYy';
}

export class CardFieldExpYy extends CardFieldBase {
  public static readonly getInputName = getSelfName;
  protected readonly _selfName = getSelfName;

  protected _maxLength(): number {
    return 2;
  }
}
