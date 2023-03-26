export class Failure extends Error {
  public readonly errorCode: string;
  public readonly requestId: string;
  
  constructor(message: string, errorCode: string, requestId: string) {
    super(message);
    this.errorCode = errorCode;
    this.requestId = requestId;
  }

  toString() {
    return 'Failure. ' + super.toString() + ', errorCode: ' + this.errorCode + ', requestId: ' + this.requestId;
  }
}
