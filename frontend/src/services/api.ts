import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
}

export interface Sale {
  id: number;
  date: string;
  customerId: number;
  userId: number;
  totalAmount: number;
  items: any[];
}

export const ProductService = {
  getProducts: () => api.get<Product[]>('/products').then(res => res.data),
  createProduct: (product: Omit<Product, 'id'>) => api.post<Product>('/products', product).then(res => res.data),
  updateProduct: (id: number, product: Omit<Product, 'id'>) => api.put<Product>(`/products/${id}`, product).then(res => res.data),
};

export const SaleService = {
  getSales: () => api.get<Sale[]>('/sales').then(res => res.data),
  createSale: (saleData: any) => api.post<Sale>('/sales', saleData).then(res => res.data),
};
