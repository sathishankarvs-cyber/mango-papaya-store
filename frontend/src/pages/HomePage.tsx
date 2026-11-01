import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Sun, HeartHandshake, Leaf } from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [mangoProducts, setMangoProducts] = useState<Product[]>([]);
  const [papayaProducts, setPapayaProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, mangoRes, papayaRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/mango?limit=4'),
          api.get('/products/papaya?limit=4'),
        ]);

        setFeaturedProducts(featRes.data?.data || []);
        setMangoProducts(mangoRes.data?.data || []);
        setPapayaProducts(papayaRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load home page products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-100/80 via-orange-50 to-amber-200/40 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 p-8 sm:p-12 lg:p-16 border border-amber-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-amber-500/15 border border-amber-400/40 px-4 py-1.5 rounded-full text-amber-900 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Direct Orchard Harvest Season 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-900 tracking-tight leading-[1.1]">
            Taste the Pure Gold of{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Mangoes
            </span>{' '}
            &{' '}
            <span className="bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent">
              Papayas
            </span>
          </h1>

          <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            We specialize in exactly two exceptional fruits. Handpicked at physiological peak maturity, 100% naturally tree-ripened, and delivered fresh to your dining table.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/mango"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 transition-all"
            >
              <span>🥭 Explore Mango Harvest</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/papaya"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm bg-white hover:bg-orange-50 text-orange-600 border-2 border-orange-400/60 shadow-md flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 transition-all"
            >
              <span>🍈 Explore Sweet Papayas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative Fruit Floating Badges */}
        <div className="hidden lg:flex absolute top-10 left-10 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-amber-200 shadow-md items-center space-x-3">
          <span className="text-2xl">🌿</span>
          <div className="text-left">
            <p className="text-xs font-bold text-stone-900">100% Organic</p>
            <p className="text-[10px] text-stone-500">Zero Carbide Ripened</p>
          </div>
        </div>

        <div className="hidden lg:flex absolute bottom-10 right-10 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-amber-200 shadow-md items-center space-x-3">
          <span className="text-2xl">⚡</span>
          <div className="text-left">
            <p className="text-xs font-bold text-stone-900">24-Hour Dispatch</p>
            <p className="text-[10px] text-stone-500">Fresh from the Trees</p>
          </div>
        </div>
      </section>

      {/* Two Categories Focus Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">Our Dedicated Specialization</h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto">
            By focusing exclusively on Mangoes and Papayas, we achieve unrivaled freshness, sweetness grading, and organic purity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mango Banner Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 text-white p-8 sm:p-10 flex flex-col justify-between h-80 shadow-xl group">
            <div className="relative z-10 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-white/20 backdrop-blur-md rounded-full">
                King of Fruits
              </span>
              <h3 className="text-3xl sm:text-4xl font-black">Royal Mango Collection</h3>
              <p className="text-amber-100 text-xs sm:text-sm max-w-md">
                Certified Ratnagiri Alphonso, GI Gir Kesar, Lucknow Dasheri & Sweet Benishan.
              </p>
            </div>
            <div className="relative z-10">
              <Link
                to="/mango"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-xs bg-white text-amber-900 hover:bg-amber-50 shadow-md transition-all"
              >
                <span>Shop All Mangoes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <span className="absolute -bottom-6 -right-6 text-9xl opacity-25 group-hover:scale-110 transition-transform duration-500">
              🥭
            </span>
          </div>

          {/* Papaya Banner Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 text-white p-8 sm:p-10 flex flex-col justify-between h-80 shadow-xl group">
            <div className="relative z-10 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-white/20 backdrop-blur-md rounded-full">
                Enzyme & Vitamin Superfood
              </span>
              <h3 className="text-3xl sm:text-4xl font-black">Farm Fresh Papayas</h3>
              <p className="text-orange-100 text-xs sm:text-sm max-w-md">
                Sun-kissed Red Lady Papayas, Hawaiian Solo Sunrise & Taiwan 786 Golden.
              </p>
            </div>
            <div className="relative z-10">
              <Link
                to="/papaya"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-xs bg-white text-orange-900 hover:bg-orange-50 shadow-md transition-all"
              >
                <span>Shop All Papayas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <span className="absolute -bottom-6 -right-6 text-9xl opacity-25 group-hover:scale-110 transition-transform duration-500">
              🍈
            </span>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Orchard Picks</span>
            </div>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">Featured Harvests</h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

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
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Mango Specials Row */}
      {mangoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🥭</span>
              <div>
                <h2 className="text-2xl font-black text-stone-900">Sweet Mango Delights</h2>
                <p className="text-xs text-stone-500">Hand-sorted by weight, brix sweetness, and fragrance</p>
              </div>
            </div>
            <Link to="/mango" className="text-sm font-bold text-amber-700 hover:underline">
              All Mangoes →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mangoProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Papaya Specials Row */}
      {papayaProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🍈</span>
              <div>
                <h2 className="text-2xl font-black text-stone-900">Rich Red Papayas</h2>
                <p className="text-xs text-stone-500">Packed with papain enzymes for daily wellness & glowing skin</p>
              </div>
            </div>
            <Link to="/papaya" className="text-sm font-bold text-orange-700 hover:underline">
              All Papayas →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {papayaProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-100 shadow-sm">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-3xl font-black text-stone-900">Why Customers Trust PSN Farm</h2>
            <p className="text-stone-500 text-sm max-w-lg mx-auto">
              We eliminate traditional middle-tier fruit markets to bring trees directly to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3 p-6 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Sun className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-base">Tree-Ripened Perfection</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fruits are harvested only after reaching optimal sugar levels on the tree, guaranteeing maximum taste.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-2xl bg-orange-50/50 border border-orange-100">
              <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-base">Chemical-Free Promise</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                We strictly prohibit calcium carbide and harmful ripening chemicals. 100% natural hay ripening only.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-base">Eco-Safe Foam Crates</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every mango and papaya is individually foam-sleeved and cushioned to arrive flawless without bruises.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
