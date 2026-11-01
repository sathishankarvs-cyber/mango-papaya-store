import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, MapPin, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { Address } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [orderNotes, setOrderNotes] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // New address form fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setLoading(true);
        await fetchCart();
        const res = await api.get('/users/addresses');
        const list: Address[] = res.data?.data || [];
        setAddresses(list);

        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr._id);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error('Failed to load checkout data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine1 || !city || !pincode) {
      setErrorMsg('Please fill in all mandatory address fields.');
      return;
    }

    try {
      setErrorMsg('');
      const res = await api.post('/users/addresses', {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state: stateName,
        pincode,
        country: 'India',
        isDefault: addresses.length === 0,
      });

      const newAddr: Address = res.data?.data;
      setAddresses([...addresses, newAddr]);
      setSelectedAddressId(newAddr._id);
      setShowNewAddressForm(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    let shippingAddress: any = null;

    if (showNewAddressForm || addresses.length === 0) {
      if (!fullName || !phone || !addressLine1 || !city || !pincode) {
        setErrorMsg('Please enter a valid shipping address before placing order.');
        return;
      }
      shippingAddress = {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state: stateName,
        pincode,
        country: 'India',
      };
    } else {
      const selected = addresses.find((a) => a._id === selectedAddressId);
      if (!selected) {
        setErrorMsg('Please select a delivery address.');
        return;
      }
      shippingAddress = {
        fullName: selected.fullName,
        phone: selected.phone,
        addressLine1: selected.addressLine1,
        addressLine2: selected.addressLine2,
        city: selected.city,
        state: selected.state,
        pincode: selected.pincode,
        country: selected.country || 'India',
      };
    }

    try {
      setPlacingOrder(true);
      setErrorMsg('');
      const res = await api.post('/orders', {
        shippingAddress,
        paymentMethod,
        notes: orderNotes,
      });

      if (res.data?.data) {
        const order = res.data.data;
        navigate(`/order-confirmation/${order.orderId}`, { state: { order } });
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-black text-stone-900">Checkout & Delivery</h1>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3 text-red-800 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-lg font-black text-stone-900">Select Delivery Address</h3>
              </div>
              {addresses.length > 0 && (
                <button
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showNewAddressForm ? 'Select Saved Address' : 'Add New Address'}</span>
                </button>
              )}
            </div>

            {!showNewAddressForm && addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddressId(addr._id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr._id
                        ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                        : 'border-stone-100 hover:border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-900">{addr.label}</span>
                      {selectedAddressId === addr._id && (
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-stone-800">{addr.fullName}</p>
                    <p className="text-xs text-stone-600 mt-1">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-xs text-stone-600">{addr.addressLine2}</p>}
                    <p className="text-xs text-stone-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-xs text-stone-500 font-medium mt-2">📱 {addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleCreateAddress} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">House/Flat & Street Address *</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Flat 402, Green Orchid Residency"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                {addresses.length > 0 && (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800"
                  >
                    Save & Use This Address
                  </button>
                )}
              </form>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-6">
            <div className="flex items-center space-x-3">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-lg font-black text-stone-900">Payment Option</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                  paymentMethod === 'COD'
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                    : 'border-stone-100 hover:border-amber-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    paymentMethod === 'COD' ? 'border-amber-500 bg-amber-500 text-white' : 'border-stone-300'
                  }`}
                >
                  {paymentMethod === 'COD' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Cash on Delivery (COD)</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Pay securely in cash or UPI when your fruit crate arrives at your doorstep.
                  </p>
                </div>
              </div>

              {/* Online Payment (UPI / Cards / Razorpay Gateway ready) */}
              <div
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                  paymentMethod === 'ONLINE'
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                    : 'border-stone-100 hover:border-amber-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    paymentMethod === 'ONLINE' ? 'border-amber-500 bg-amber-500 text-white' : 'border-stone-300'
                  }`}
                >
                  {paymentMethod === 'ONLINE' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Online Payment / UPI</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Instant UPI, NetBanking or Debit/Credit card dispatch confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Special Instructions / Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Leave crate with security gate / Ring bell twice..."
                rows={2}
                className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Basket Review */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-stone-900">Items in Your Order</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.product.toString()} className="flex items-center justify-between text-xs py-1.5 border-b border-amber-50">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=100&q=80'}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-amber-100 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-stone-900 line-clamp-1">{item.name}</p>
                      <p className="text-stone-500">{item.quantity} {item.unit}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">₹{item.subtotal.toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-amber-50 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₹{cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Seasonal Savings</span>
                  <span>-₹{cart.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-stone-900">
                  {cart.deliveryFee === 0 ? <span className="text-emerald-600 uppercase">FREE</span> : `₹${cart.deliveryFee.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-amber-100">
              <span className="text-sm font-bold text-stone-900">Total Payable</span>
              <span className="text-2xl font-black text-stone-900">
                ₹{cart.totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {placingOrder ? (
                <span>Reserving & Placing Order...</span>
              ) : (
                <span>Confirm & Place Order (₹{cart.totalAmount.toFixed(0)})</span>
              )}
            </button>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-100 text-xs text-stone-500 flex items-center space-x-3">
            <Truck className="w-5 h-5 text-amber-500 shrink-0" />
            <span>Orders placed before 4 PM are packed & dispatched the same evening.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
