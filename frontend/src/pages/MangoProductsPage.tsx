import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, Sun } from 'lucide-react';

export const MangoProductsPage: React.FC = () => {
  const [mangoes, setMangoes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMangoes = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products/mango');
        setMangoes(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load mango products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMangoes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Mango Category Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white p-8 sm:p-12 shadow-lg">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold">
            <Sun className="w-3.5 h-3.5" />
            <span>King of Tropical Fruits</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Authentic Mango Harvest
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            From the world-renowned volcanic soil of Ratnagiri to the foothills of Girnar. GI-certified, chemical-free, tree-ripened heritage mangoes.
          </p>
        </div>
        <span className="absolute -bottom-8 -right-8 text-9xl opacity-20 pointer-events-none">
          🥭
        </span>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-5 border border-amber-100 animate-pulse space-y-4">
              <div className="aspect-square bg-amber-100/60 rounded-2xl" />
              <div className="h-4 bg-amber-100 rounded w-3/4" />
              <div className="h-3 bg-amber-50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mangoes.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
