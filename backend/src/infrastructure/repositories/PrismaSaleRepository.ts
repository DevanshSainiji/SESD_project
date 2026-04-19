import { ISaleRepository } from './ISaleRepository';
import { ISale, Sale } from '../../domain/Sale';
import { db } from '../database/db.singleton';

export class PrismaSaleRepository implements ISaleRepository {
  public async create(sale: ISale): Promise<ISale> {
    const createdSale = await db.sale.create({
      data: {
        customerId: sale.customerId,
        userId: sale.userId,
        totalAmount: sale.totalAmount,
        items: {
          create: sale.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    return new Sale(
      createdSale.customerId,
      createdSale.userId,
      createdSale.totalAmount,
      createdSale.items,
      createdSale.id,
      createdSale.date
    );
  }

  public async findAll(): Promise<ISale[]> {
    const sales = await db.sale.findMany({ include: { items: true } });
    return sales.map(s => new Sale(s.customerId, s.userId, s.totalAmount, s.items, s.id, s.date));
  }

  public async findById(id: number): Promise<ISale | null> {
    const s = await db.sale.findUnique({
      where: { id },
      include: { items: true }
    });
    if (!s) return null;
    return new Sale(s.customerId, s.userId, s.totalAmount, s.items, s.id, s.date);
  }
}
