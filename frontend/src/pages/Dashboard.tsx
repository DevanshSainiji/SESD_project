import React, { useEffect, useState } from 'react';
import { ProductService, SaleService, type Product, type Sale } from '../services/api';
import { Package, ShoppingCart, DollarSign, ArrowUpRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    ProductService.getProducts().then(setProducts);
    SaleService.getSales().then(setSales);
  }, []);

  const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const lowStockCount = products.filter(p => p.stock < 5).length;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalSalesAmount.toFixed(2)}`} 
          icon={<DollarSign className="text-emerald-500" />} 
          trend="+12%" 
        />
        <StatCard 
          title="Total Sales" 
          value={sales.length.toString()} 
          icon={<ShoppingCart className="text-blue-500" />} 
          trend="+5%" 
        />
        <StatCard 
          title="Total Products" 
          value={products.length.toString()} 
          icon={<Package className="text-purple-500" />} 
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockCount.toString()} 
          icon={<Package className="text-red-500" />} 
          className={lowStockCount > 0 ? "border-red-500/50 bg-red-500/5" : ""}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="lg:col-span-2 bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Sales</h3>
            <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-700">
                  <th className="pb-4 font-medium">Sale ID</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sales.slice(0, 5).map(sale => (
                  <tr key={sale.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 font-medium">#{sale.id}</td>
                    <td className="py-4 text-slate-400">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="py-4">${sale.totalAmount.toFixed(2)}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs">Completed</span>
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">No sales transactions yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watch */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Low Stock Watch</h3>
          <div className="space-y-4">
            {products.filter(p => p.stock < 10).slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.brand}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${product.stock < 5 ? "text-red-500" : "text-amber-500"}`}>{product.stock}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Left</p>
                </div>
              </div>
            ))}
            {products.filter(p => p.stock < 10).length === 0 && (
              <p className="py-8 text-center text-slate-500">All products well-stocked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, className = "" }: { title: string; value: string; icon: React.ReactNode; trend?: string; className?: string }) => (
  <div className={`bg-[#1e293b] border border-slate-700 rounded-2xl p-6 hover:border-slate-500 transition-all ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-800 rounded-xl">
        {icon}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
          {trend} <ArrowUpRight size={12} />
        </div>
      )}
    </div>
    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
