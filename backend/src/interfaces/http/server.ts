import express from 'express';
import cors from 'cors';
import { PrismaProductRepository } from '../../infrastructure/repositories/PrismaProductRepository.js';
import { PrismaSaleRepository } from '../../infrastructure/repositories/PrismaSaleRepository.js';
import { SaleService } from '../../application/services/SaleService.js';
import { ProductController } from './controllers/ProductController.js';
import { SaleController } from './controllers/SaleController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => res.json({ ok: true }));

// --- Dependency Injection ---
const productRepo = new PrismaProductRepository();
const saleRepo = new PrismaSaleRepository();
const saleService = new SaleService(saleRepo, productRepo);

const productController = new ProductController(productRepo);
const saleController = new SaleController(saleService);

// --- Routes ---
app.get('/api/products', productController.getAllProducts);
app.post('/api/products', productController.createProduct);
app.patch('/api/products/:id/stock', productController.updateStock);
app.get('/api/sales', saleController.getAllSales);
app.post('/api/sales', saleController.processSale);

// --- Global Error Handler ---
app.use((err: any, req: any, res: any, next: any) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
