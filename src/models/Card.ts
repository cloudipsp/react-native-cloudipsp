import {isCvv4Length} from '../CvvUtils';

function lunaCheck(cardNumber: string): boolean {
  let sum = 0;
  let odd = true;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    try {
      let num = Number(cardNumber.charAt(i));
      odd = !odd;
      if (odd) {
        num *= 2;
      }
      if (num > 9) {
        num -= 9;
      }
      sum += num;
    } catch (e) {
      return false;
    }
  }

  return sum % 10 === 0;
}

function isValidExpireMonthValue(mm: number): boolean {
  return mm >= 1 && mm <= 12;
}

function isValidExpireYearValue(yy: number): boolean {
  return yy >= 23 && yy <= 99;
}

export class Card {
  public readonly getSource = (): string => {
    return 'form';
  };

  private readonly __getCardNumber__ = (): string => {
    throw new Error('Unimplemented')
  };
  private readonly __getExpYy__ = (): number => {
    throw new Error('Unimplemented')
  };
  private readonly __getExpMm__ = (): number => {
    throw new Error('Unimplemented')
  };
  private readonly __getCvv__ = (): string => {
    throw new Error('Unimplemented')
  };

  public readonly isValidCardNumber = () => {
    const cardNumber = this.__getCardNumber__();
    if (!(12 <= cardNumber.length && cardNumber.length <= 19)) {
      return false;
    }
    return lunaCheck(cardNumber);
  };

  public readonly isValidExpireMonth = (): boolean => {
    const mm = this.__getExpMm__();
    return isValidExpireMonthValue(mm);
  };

  public readonly isValidExpireYear = (): boolean => {
    const yy = this.__getExpYy__();
    if (!isValidExpireYearValue(yy)) {
      return false;
    }
    const year = new Date().getFullYear() - 2000;
    return year <= yy;
  };

  public readonly isValidExpireDate = (): boolean => {
    let mm = this.__getExpMm__();
    if (!isValidExpireMonthValue(mm)) {
      return false;
    }
    let yy = this.__getExpYy__();
    if (!isValidExpireYearValue(yy)) {
      return false;
    }

    const now = new Date();
    const year = now.getFullYear() - 2000;
    const month = now.getMonth() + 1;

    return (yy > year) || (yy >= year && mm >= month);
  };

  public readonly isValidCvv = (): boolean => {
    let cvv = this.__getCvv__();
    if (isCvv4Length(this.__getCardNumber__())) {
      return cvv.length === 4;
    } else {
      return cvv.length === 3;
    }
  };

  public readonly isValidCard = (): boolean => {
    return this.isValidCardNumber() &&
      this.isValidExpireDate() &&
      this.isValidCvv();
  };
}

export interface CardPrivate {
  getSource(): string;
  __getCardNumber__(): string;
  __getExpYy__(): number;
  __getExpMm__(): number;
  __getCvv__(): string;
}
