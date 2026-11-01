import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Heart, Sparkles } from 'lucide-react';

export const PapayaProductsPage: React.FC = () => {
  const [papayas, setPapayas] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapayas = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products/papaya');
        setPapayas(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load papaya products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapayas();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Papaya Category Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white p-8 sm:p-12 shadow-lg">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold">
            <Heart className="w-3.5 h-3.5" />
            <span>Enzyme & Digestive Wellness</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Sun-Kissed Fresh Papayas
          </h1>
          <p className="text-orange-100 text-xs sm:text-sm leading-relaxed">
            Loaded with active papain digestive enzymes, vitamins A & C, and vital antioxidants. Directly harvested from sunlit organic groves.
          </p>
        </div>
        <span className="absolute -bottom-8 -right-8 text-9xl opacity-20 pointer-events-none">
          🍈
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
          {papayas.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
