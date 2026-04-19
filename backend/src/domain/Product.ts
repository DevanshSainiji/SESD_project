export interface IProduct {
  id?: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  updateStock(quantity: number): void;
}

export class Product implements IProduct {
  constructor(
    public name: string,
    public brand: string,
    public price: number,
    public stock: number,
    public id?: number
  ) {}

  public updateStock(quantity: number): void {
    if (this.stock + quantity < 0) {
      throw new Error("Insufficient stock");
    }
    this.stock += quantity;
  }
}
