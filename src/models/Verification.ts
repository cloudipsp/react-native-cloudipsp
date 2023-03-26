export class Verification {
  public readonly name: string;
  public static readonly AMOUNT = new Verification('amount');
  public static readonly CODE = new Verification('code');

  constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}
