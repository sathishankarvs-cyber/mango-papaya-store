import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, AlertCircle, Package, Box } from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const categoryColor = (category: string) => {
    return category === 'MANGO' ? 'text-amber-400 bg-amber-500/10' : 'text-orange-400 bg-orange-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Management</h1>
          <p className="text-slate-400 mt-1">Manage mangoes & papayas inventory</p>
        </div>
        <Link to="/products/new" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center space-x-3 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <button className="px-5 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white flex items-center space-x-2 hover:bg-slate-800 transition-colors">
          <Box className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Products List */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800/60">
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Product</th>
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Price</th>
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Stock</th>
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center">
                  <p className="text-slate-500">No products found</p>
                </td>
              </tr>
            ) : (
              products.map((product: Product) => (
                <tr key={product._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-3">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColor(product.category)}`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    ₹{product.price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-slate-300">{product.availableQuantity}</span>{' '}
                    <span className="text-xs text-slate-500">kg available</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={product.stockStatus} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right space-y-2">
                    <Link to={`/products/edit/${product._id}`} className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center space-x-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center space-x-1">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};