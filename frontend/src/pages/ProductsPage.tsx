import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Sparkles } from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get('category') || 'ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {
          sort: sortBy,
          order: 'desc',
        };
        if (categoryFilter !== 'ALL') {
          params.category = categoryFilter;
        }

        const res = await api.get('/products', { params });
        setProducts(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, sortBy]);

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    if (cat === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/60">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Farm Direct Catalog</span>
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight mt-1">
            All Farm-Fresh Fruits
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing {products.length} handpicked Mangoes and Papayas from our certified groves
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Tabs */}
          <div className="flex items-center p-1 bg-white border border-amber-200 rounded-2xl shadow-sm">
            <button
              onClick={() => handleCategoryChange('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'ALL'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-stone-600 hover:text-amber-700'
              }`}
            >
              All Fruits
            </button>
            <button
              onClick={() => handleCategoryChange('MANGO')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'MANGO'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-stone-600 hover:text-amber-700'
              }`}
            >
              🥭 Mangoes
            </button>
            <button
              onClick={() => handleCategoryChange('PAPAYA')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'PAPAYA'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-stone-600 hover:text-orange-700'
              }`}
            >
              🍈 Papayas
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 bg-white border border-amber-200 px-3 py-2 rounded-2xl text-xs font-semibold text-stone-700 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-stone-900 cursor-pointer"
            >
              <option value="createdAt">Latest Harvest</option>
              <option value="price">Price (Low to High)</option>
              <option value="rating">Highest Rated</option>
              <option value="availableQuantity">Stock Available</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-5 border border-amber-100 animate-pulse space-y-4">
              <div className="aspect-square bg-amber-100/60 rounded-2xl" />
              <div className="h-4 bg-amber-100 rounded w-3/4" />
              <div className="h-3 bg-amber-50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-amber-100 p-8 space-y-4">
          <span className="text-6xl">🥭</span>
          <h3 className="text-xl font-bold text-stone-900">No fruits found in this category</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Try switching filters or check back when the next morning harvest is completed.
          </p>
          <button
            onClick={() => handleCategoryChange('ALL')}
            className="px-6 py-2.5 rounded-full bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 shadow-md"
          >
            Show All Fruits
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
