import { IProductRepository } from './IProductRepository';
import { IProduct, Product } from '../../domain/Product';
import { db } from '../database/db.singleton';

/**
 * PrismaProductRepository implements the IProductRepository interface 
 * using Prisma as the data access layer.
 */
export class PrismaProductRepository implements IProductRepository {
  public async findAll(): Promise<IProduct[]> {
    const products = await db.product.findMany();
    return products.map(p => new Product(p.name, p.brand, p.price, p.stock, p.id));
  }

  public async findById(id: number): Promise<IProduct | null> {
    const p = await db.product.findUnique({ where: { id } });
    if (!p) return null;
    return new Product(p.name, p.brand, p.price, p.stock, p.id);
  }

  public async save(product: IProduct): Promise<IProduct> {
    const p = await db.product.upsert({
      where: { id: product.id || -1 },
      update: {
        name: product.name,
        brand: product.brand,
        price: product.price,
        stock: product.stock
      },
      create: {
        name: product.name,
        brand: product.brand,
        price: product.price,
        stock: product.stock
      }
    });
    return new Product(p.name, p.brand, p.price, p.stock, p.id);
  }

  public async updateStock(id: number, quantity: number): Promise<void> {
    await db.product.update({
      where: { id },
      data: {
        stock: {
          increment: quantity
        }
      }
    });
  }

  public async delete(id: number): Promise<void> {
    await db.product.delete({ where: { id } });
  }
}
