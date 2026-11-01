import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Check, ShoppingBag, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { SeasonalBadge } from './SeasonalBadge';
import { RatingStars } from './RatingStars';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isAvailable =
    product.isSeasonallyAvailable &&
    product.availableQuantity > 0 &&
    product.stockStatus !== 'SEASONAL_UNAVAILABLE' &&
    product.stockStatus !== 'OUT_OF_STOCK';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAvailable) return;

    try {
      setIsAdding(true);
      setErrorMessage('');
      await addItem(product._id, 1);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to add item');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  const discountPercent =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  return (
    <div className="group relative bg-white rounded-3xl border border-amber-100 overflow-hidden shadow-sm hover:fruit-shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Category and Discount Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black tracking-wide shadow-sm ${
            product.category === 'MANGO'
              ? 'bg-amber-400 text-amber-950'
              : 'bg-orange-500 text-white'
          }`}
        >
          {product.category === 'MANGO' ? '🥭 Mango' : '🍈 Papaya'}
        </span>
        {discountPercent && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-amber-50/50 block">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="bg-stone-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg text-center">
              {!product.isSeasonallyAvailable ? 'Seasonal Unavailable' : 'Out of Stock'}
            </span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-medium text-stone-500 truncate">{product.origin}</span>
            <SeasonalBadge
              stockStatus={product.stockStatus}
              isSeasonallyAvailable={product.isSeasonallyAvailable}
              seasonalMessage={product.seasonalMessage}
            />
          </div>

          <Link to={`/product/${product.slug}`}>
            <h3 className="font-bold text-stone-900 text-base group-hover:text-amber-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="mt-2.5">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        </div>

        {/* Pricing and Add to Cart */}
        <div className="pt-3 border-t border-amber-50">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-black text-stone-900">
              ₹{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-stone-400 line-through font-medium">
                ₹{product.price}
              </span>
            )}
            <span className="text-xs text-stone-500 font-medium">/{product.unit}</span>
          </div>

          {errorMessage && (
            <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> {errorMessage}
            </p>
          )}

          <div className="mt-3">
            {isAvailable ? (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-amber-500/20'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-stone-100 text-stone-400 cursor-not-allowed text-center"
              >
                {!product.isSeasonallyAvailable ? 'Seasonal Unavailable' : 'Out of Stock'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
