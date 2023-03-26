export class Lang {
  public readonly name: string;
  public static readonly RU = new Lang('ru');
  public static readonly UK = new Lang('uk');
  public static readonly EN = new Lang('en');
  public static readonly LV = new Lang('lv');
  public static readonly FR = new Lang('fr');

  constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}
