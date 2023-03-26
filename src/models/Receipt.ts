export class Receipt {
  public readonly maskedCard: string;
  public readonly cardBin: string;
  public readonly amount: number;
  public readonly paymentId: number;
  public readonly currency: string;
  public readonly status: string;
  public readonly transactionType: string;
  public readonly senderCellPhone: string;
  public readonly senderAccount: string;
  public readonly cardType: string;
  public readonly rrn: string;
  public readonly approvalCode: string;
  public readonly responseCode: string;
  public readonly productId: string;
  public readonly recToken: string;
  public readonly recTokenLifeTime: Date | undefined;
  public readonly reversalAmount: number;
  public readonly settlementAmount: number;
  public readonly settlementCurrency: string;
  public readonly settlementDate: Date | undefined;
  public readonly eci: number;
  public readonly fee: number;
  public readonly actualAmount: number;
  public readonly actualCurrency: string;
  public readonly paymentSystem: string;
  public readonly verificationStatus: string;
  public readonly signature: string;
  public readonly email: string;
  public readonly responseUrl: string | undefined;

  constructor(maskedCard: string,
              cardBin: string,
              amount: number,
              paymentId: number,
              currency: string,
              status: string,
              transactionType: string,
              senderCellPhone: string,
              senderAccount: string,
              cardType: string,
              rrn: string,
              approvalCode: string,
              responseCode: string,
              productId: string,
              recToken: string,
              recTokenLifeTime: Date | undefined,
              reversalAmount: number,
              settlementAmount: number,
              settlementCurrency: string,
              settlementDate: Date | undefined,
              eci: number,
              fee: number,
              actualAmount: number,
              actualCurrency: string,
              paymentSystem: string,
              verificationStatus: string,
              signature: string,
              email: string,
              responseUrl: string | undefined) {
    this.maskedCard = maskedCard;
    this.cardBin = cardBin;
    this.amount = amount;
    this.paymentId = paymentId;
    this.currency = currency;
    this.status = status;
    this.transactionType = transactionType;
    this.senderCellPhone = senderCellPhone;
    this.senderAccount = senderAccount;
    this.cardType = cardType;
    this.rrn = rrn;
    this.approvalCode = approvalCode;
    this.responseCode = responseCode;
    this.productId = productId;
    this.recToken = recToken;
    this.recTokenLifeTime = recTokenLifeTime;
    this.reversalAmount = reversalAmount;
    this.settlementAmount = settlementAmount;
    this.settlementCurrency = settlementCurrency;
    this.settlementDate = settlementDate;
    this.eci = eci;
    this.fee = fee;
    this.actualAmount = actualAmount;
    this.actualCurrency = actualCurrency;
    this.paymentSystem = paymentSystem;
    this.verificationStatus = verificationStatus;
    this.signature = signature;
    this.email = email;
    this.responseUrl = responseUrl;
  }

  public dumpFields!: () => any;

  static __easyDateParser__(str: string): Date | undefined {//expected 05.01.2021 01:31:04
    //why should we use own parser instead of import moment or ... ?
    //because we are library and we:
    //1. should be as tiny as possible
    //2. our clients/developers may use different moment/... versions.
    try {
      if (!str || str.length === 0) {
        return undefined;
      }
      const [date, time] = str.split(' ');
      const [days, months, years] = date.split('.');
      const [hours, minutes, seconds] = time.split(':');
      return new Date(
        Number(years),
        Number(months) - 1,
        Number(days),
        Number(hours),
        Number(minutes),
        Number(seconds),
        0
      );
    } catch (e) {
      return undefined;
    }
  }

  static __fromOrderData__(orderData: any, responseUrl?: string): Receipt {
    let receipt = new Receipt
    (
      orderData.masked_card,
      orderData.card_bin,
      Number(orderData.amount),
      orderData.payment_id,
      orderData.currency,
      orderData.order_status,
      orderData.tran_type,
      orderData.sender_cell_phone,
      orderData.sender_account,
      orderData.card_type,
      orderData.rrn,
      orderData.approval_code,
      orderData.response_code,
      orderData.product_id,
      orderData.rectoken,
      this.__easyDateParser__(orderData.rectoken_lifetime),
      orderData.reversal_amount,
      orderData.settlement_amount,
      orderData.settlement_currency,
      this.__easyDateParser__(orderData.settlement_date),
      orderData.eci,
      orderData.fee,
      orderData.actual_amount,
      orderData.actual_currency,
      orderData.payment_system,
      orderData.verification_status,
      orderData.signature,
      orderData.email,
      responseUrl,
    );
    receipt.dumpFields = () => {
      return orderData;
    };
    return receipt;
  }
}
