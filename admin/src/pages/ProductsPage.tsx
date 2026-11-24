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

  const [filterCategory, setFilterCategory] = useState<'ALL' | 'MANGO' | 'PAPAYA'>('ALL');

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

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete product');
      fetchProducts();
    }
  };

  const categoryColor = (category: string) => {
    return category === 'MANGO' ? 'text-amber-400 bg-amber-500/10' : 'text-orange-400 bg-orange-500/10';
  };

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term) ||
      (p.category && p.category.toLowerCase().includes(term));
    const matchesCategory = filterCategory === 'ALL' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search products by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          {(['ALL', 'MANGO', 'PAPAYA'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                filterCategory === cat
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Products' : cat === 'MANGO' ? '🥭 Mangoes' : '🍈 Papayas'}
            </button>
          ))}
        </div>
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
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center">
                  <p className="text-slate-500">No products found</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product: Product) => (
                <tr key={product._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
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
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(product.category)}`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-300 font-medium">
                    ₹{product.price.toLocaleString('en-IN')}
                    {product.discountPrice && (
                      <span className="ml-1 text-xs text-emerald-400 font-normal">
                        (₹{product.discountPrice})
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-slate-300">{product.availableQuantity}</span>{' '}
                    <span className="text-xs text-slate-500">kg available</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={product.stockStatus} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <Link
                        to={`/products/edit/${product._id}`}
                        className="text-amber-400 hover:text-amber-300 text-sm font-medium inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-amber-400/10 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id, product.name)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
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