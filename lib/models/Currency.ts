export class Currency {
  public readonly code: string;
  public static readonly UAH = new Currency('UAH');
  public static readonly USD = new Currency('USD');
  public static readonly RUB = new Currency('RUB');
  public static readonly EUR = new Currency('EUR');
  public static readonly GBP = new Currency('GBP');
  public static readonly KZT = new Currency('KZT');

  constructor(code: string) {
    this.code = code;
  }

  toString() {
    return this.code;
  }
}
