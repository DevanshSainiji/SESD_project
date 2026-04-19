export interface ISaleItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface ISale {
  id?: number;
  date: Date;
  customerId: number;
  userId: number;
  totalAmount: number;
  items: ISaleItem[];
}

export class Sale implements ISale {
  constructor(
    public customerId: number,
    public userId: number,
    public totalAmount: number,
    public items: ISaleItem[],
    public id?: number,
    public date: Date = new Date()
  ) {}

  public generateInvoice(): string {
    return `Invoice #${this.id || 'NEW'} - Total: ${this.totalAmount}`;
  }
}
