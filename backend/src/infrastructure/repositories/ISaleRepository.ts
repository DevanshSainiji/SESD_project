import { ISale } from '../../domain/Sale';

export interface ISaleRepository {
  create(sale: ISale): Promise<ISale>;
  findAll(): Promise<ISale[]>;
  findById(id: number): Promise<ISale | null>;
}
