import {CardFieldBase, CardFieldBasePrivate} from './CardFieldBase';

function getSelfName() {
  return 'CardFieldCvv';
}

export class CardFieldCvv extends CardFieldBase {
  public static readonly getInputName = getSelfName;
  protected readonly _selfName = getSelfName;

  protected _maxLength(): number {
    return 3;
  }

  protected _isSecure(): boolean {
    return true;
  }

  private _setCvv4(enabled: boolean): void {
    this._setMaxLength(enabled ? 4 : 3);
    if (!enabled) {
      const cvv = this._getText();
      if (cvv.length === 4) {
        this._setText(cvv.substr(0, 3));
      }
    }
  }
}

export interface CardFieldCvvPrivate extends CardFieldBasePrivate {
  _setCvv4(enabled: boolean): void;
}
