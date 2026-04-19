import { Request, Response } from 'express';
import { IProductRepository } from '../../../infrastructure/repositories/IProductRepository';
import { DomainFactory } from '../../../domain/DomainFactory';

export class ProductController {
  constructor(private productRepository: IProductRepository) {}

  public getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productRepository.findAll();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public createProduct = async (req: Request, res: Response) => {
    try {
      const { name, brand, price, stock } = req.body;
      const product = DomainFactory.createProduct(name, brand, price, stock);
      const savedProduct = await this.productRepository.save(product);
      res.status(201).json(savedProduct);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, brand, price, stock } = req.body;
      const product = DomainFactory.createProduct(name, brand, price, stock, Number(id));
      const updatedProduct = await this.productRepository.save(product);
      res.json(updatedProduct);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public updateStock = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      await this.productRepository.updateStock(Number(id), quantity);
      res.json({ message: 'Stock updated' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
