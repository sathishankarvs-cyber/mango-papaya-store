import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isLoading, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">Sign in to view your fruit basket</h2>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          Sign in to save your farm-fresh selections, receive exclusive season discounts, and track delivery.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-orange-500/20"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <span className="text-7xl block animate-bounce">🥭</span>
        <h2 className="text-3xl font-black text-stone-900">Your basket is empty</h2>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          Explore our certified organic Mangoes and sun-ripened Red Lady Papayas to start your order.
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm rounded-full shadow-lg shadow-amber-500/20"
        >
          Explore All Fruits
        </Link>
      </div>
    );
  }

  const freeShippingTarget = 500;
  const freeShippingRemaining = Math.max(0, freeShippingTarget - cart.subtotal);
  const freeShippingProgress = Math.min(100, (cart.subtotal / freeShippingTarget) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-amber-200/60">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Your Fruit Basket</h1>
          <p className="text-xs text-stone-500 mt-1">
            {cart.items.length} item type(s) ready for orchard packing
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
        >
          Clear Basket
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <div className="flex items-center space-x-1.5">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>
              {freeShippingRemaining === 0
                ? '🎉 You unlocked FREE Orchard Delivery!'
                : `Add ₹${freeShippingRemaining.toFixed(0)} more for FREE Delivery!`}
            </span>
          </div>
          <span className="text-amber-700 font-extrabold">{freeShippingProgress.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Table/List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product.toString()}
              className="p-4 sm:p-5 bg-white rounded-3xl border border-amber-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between"
            >
              {/* Product Info */}
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=200&q=80'}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-amber-100 shrink-0"
                />
                <div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                      item.category === 'MANGO' ? 'bg-amber-100 text-amber-900' : 'bg-orange-100 text-orange-900'
                    }`}
                  >
                    {item.category === 'MANGO' ? '🥭 Mango' : '🍈 Papaya'}
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">{item.name}</h4>
                  <p className="text-xs text-stone-500 font-medium">
                    ₹{item.discountPrice || item.price} / {item.unit}
                  </p>
                </div>
              </div>

              {/* Quantity Stepper & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-amber-50">
                <div className="flex items-center border border-amber-200 bg-amber-50/40 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.product.toString(), item.quantity - 1)}
                    className="p-1.5 text-stone-600 hover:text-amber-600 rounded-lg hover:bg-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-black text-stone-900">
                    {item.quantity} <span className="text-[10px] font-normal">{item.unit}</span>
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.toString(), item.quantity + 1)}
                    className="p-1.5 text-stone-600 hover:text-amber-600 rounded-lg hover:bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="font-black text-base text-stone-900">
                    ₹{item.subtotal.toFixed(0)}
                  </span>
                </div>

                <button
                  onClick={() => removeItem(item.product.toString())}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-stone-900">Order Summary</h3>

            <div className="space-y-2.5 text-xs text-stone-600 border-b border-amber-50 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₹{cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Seasonal Savings</span>
                  <span className="font-bold">-₹{cart.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-stone-900">
                  {cart.deliveryFee === 0 ? (
                    <span className="text-emerald-600 uppercase">FREE</span>
                  ) : (
                    `₹${cart.deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-sm font-bold text-stone-900">Total Payable</span>
              <span className="text-2xl font-black text-stone-900">
                ₹{cart.totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              disabled={isLoading || cart.items.length === 0}
              className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-100 flex items-center space-x-3 text-xs text-stone-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Guaranteed fresh trees delivery with 100% replacement assurance.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
