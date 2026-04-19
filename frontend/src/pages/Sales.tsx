import React, { useEffect, useState, useRef } from 'react';
import { ProductService, SaleService, type Product } from '../services/api';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const Sales: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, { 
        scale: 2, 
        backgroundColor: '#1e293b',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${new Date().getTime()}.pdf`);
    } catch (error: any) {
      console.error("Failed to generate PDF:", error);
      alert("PDF Generation Failed: " + (error.message || String(error)));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    ProductService.getProducts().then(items => setProducts(items.filter(p => p.stock > 0)));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, Math.min(item.product.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;

    try {
      await SaleService.createSale({
        customerId: 1, // Walk-in customer from seed
        userId: 1,     // Admin from seed
        totalAmount,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      });
      
      // Generate PDF BEFORE showing success state to avoid mid-render DOM disruption
      await downloadInvoice();
      
      setIsSuccess(true);
      setCart([]);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      alert("Failed to process sale. Check stock levels.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-2">Available Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-[#1e293b] border border-slate-700 p-4 rounded-2xl hover:border-blue-500/50 transition-all group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold">{product.name}</h4>
                  <p className="text-xs text-slate-400">{product.brand}</p>
                </div>
                <p className="font-bold text-blue-500">${product.price}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-slate-500 font-medium">{product.stock} units available</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="p-2 bg-slate-800 group-hover:bg-blue-600 rounded-lg text-slate-400 group-hover:text-white transition-all shadow-sm"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart / Invoice Summary */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 h-fit sticky top-8">
        <div ref={invoiceRef} className="p-4 rounded-xl -mx-4 -mt-4 mb-4" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart style={{ color: '#3b82f6' }} />
            <h3 className="text-xl font-semibold" style={{ color: '#ffffff' }}>Checkout Summary</h3>
          </div>

        <div className="space-y-4 mb-8">
          {cart.map(item => (
            <div key={item.product.id} className="flex items-center justify-between gap-4 p-3 rounded-xl border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
              <div className="flex-1">
                <p className="font-medium text-sm" style={{ color: '#ffffff' }}>{item.product.name}</p>
                <p className="text-xs" style={{ color: '#94a3b8' }}>${item.product.price} / unit</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 rounded" style={{ backgroundColor: '#334155' }}><Minus size={14} style={{ color: '#ffffff' }} /></button>
                <span className="w-8 text-center font-bold" style={{ color: '#ffffff' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 rounded" style={{ backgroundColor: '#334155' }}><Plus size={14} style={{ color: '#ffffff' }} /></button>
              </div>
              <p className="w-20 text-right font-bold text-sm" style={{ color: '#ffffff' }}>${(item.product.price * item.quantity).toFixed(2)}</p>
              <button 
                onClick={() => removeFromCart(item.product.id)}
                className="ml-2"
                style={{ color: '#ef4444' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="py-12 text-center" style={{ color: '#64748b' }}>
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-10" />
              <p>Your cart is empty.</p>
            </div>
          )}
        </div>

        <div className="pt-6 space-y-3" style={{ borderTop: '1px solid #334155' }}>
          <div className="flex justify-between" style={{ color: '#cbd5e1' }}>
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between" style={{ color: '#cbd5e1' }}>
            <span>Tax (GST 18%)</span>
            <span>${(totalAmount * 0.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-3" style={{ borderTop: '1px solid #0f172a', color: '#10b981' }}>
            <span>Total</span>
            <span>${(totalAmount * 1.18).toFixed(2)}</span>
          </div>
        </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={cart.length === 0 || isGeneratingPdf}
          className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
        >
          {isSuccess ? <CheckCircle2 /> : isGeneratingPdf ? "Generating PDF..." : "Complete Sale & Print Invoice"}
        </button>

        {isSuccess && (
          <p className="text-emerald-500 text-center mt-4 font-medium animate-in fade-in zoom-in duration-300">
            Sale processed successfully!
          </p>
        )}
      </div>
    </div>
  );
};
