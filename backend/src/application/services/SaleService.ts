import { ISaleRepository } from '../../infrastructure/repositories/ISaleRepository';
import { IProductRepository } from '../../infrastructure/repositories/IProductRepository';
import { ISale, Sale } from '../../domain/Sale';

/**
 * SaleService coordinates business logic between Sales and Inventory.
 * Demonstrates Dependency Injection (SOLID: Dependency Inversion).
 */
export class SaleService {
  constructor(
    private saleRepository: ISaleRepository,
    private productRepository: IProductRepository
  ) {}

  public async processSale(saleData: ISale): Promise<ISale> {
    // 1. Verify stock for all items
    for (const item of saleData.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
    }

    // 2. Create the sale record
    const createdSale = await this.saleRepository.create(saleData);

    // 3. Update stock levels (SOLID: Single Responsibility - the service handles coordination)
    for (const item of saleData.items) {
      await this.productRepository.updateStock(item.productId, -item.quantity);
    }

    return createdSale;
  }

  public async getAllSales(): Promise<ISale[]> {
    return this.saleRepository.findAll();
  }
}
