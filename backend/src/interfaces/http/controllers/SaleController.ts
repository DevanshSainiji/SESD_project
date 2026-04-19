import { Request, Response } from 'express';
import { SaleService } from '../../../application/services/SaleService';

export class SaleController {
  constructor(private saleService: SaleService) {}

  public processSale = async (req: Request, res: Response) => {
    try {
      const saleData = req.body;
      // In a real app, userId would come from authentication middleware
      const sale = await this.saleService.processSale(saleData);
      res.status(201).json(sale);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public getAllSales = async (req: Request, res: Response) => {
    try {
      const sales = await this.saleService.getAllSales();
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
