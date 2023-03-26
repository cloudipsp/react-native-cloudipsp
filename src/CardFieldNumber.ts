import {CardFieldBase} from './CardFieldBase';


function getSelfName(): string {
  return 'CardFieldNumber';
}

export class CardFieldNumber extends CardFieldBase {
  public static readonly getInputName = getSelfName;
  protected readonly _selfName = getSelfName;

  protected _maxLength(): number {
    return 19;
  }
}
