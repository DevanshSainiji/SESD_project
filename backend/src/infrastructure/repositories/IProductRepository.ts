import { IProduct } from '../../domain/Product';

export interface IProductRepository {
  findAll(): Promise<IProduct[]>;
  findById(id: number): Promise<IProduct | null>;
  save(product: IProduct): Promise<IProduct>;
  updateStock(id: number, quantity: number): Promise<void>;
  delete(id: number): Promise<void>;
}
