import { User, UserRole } from './User';
import { Product } from './Product';

/**
 * DomainFactory implements the Factory pattern to centralize 
 * the creation of domain entities and ensure consistent initialization.
 */
export class DomainFactory {
  public static createUser(name: string, email: string, role: UserRole, id?: number): User {
    return new User(name, email, role, id);
  }

  public static createProduct(name: string, brand: string, price: number, stock: number, id?: number): Product {
    return new Product(name, brand, price, stock, id);
  }
}
