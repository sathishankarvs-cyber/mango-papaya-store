import React, { useState } from 'react';
import { Search, Package, Truck, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { OrderTimeline } from '../components/OrderTimeline';

export const OrderTrackingPage: React.FC = () => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      setTrackingData(null);
      const res = await api.get(`/orders/track/${orderIdInput.trim()}`);
      setTrackingData(res.data?.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Order reference not found. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-stone-900">Track Your Fruit Delivery</h1>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Enter your unique order number to see live orchard harvest & delivery updates.
        </p>
      </div>

      {/* Tracking Form */}
      <form onSubmit={handleSearchOrder} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. MP81726354)"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
            className="w-full pl-10 pr-4 py-3.5 text-xs bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold uppercase shadow-sm"
            required
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-4" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl shadow-md disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl max-w-md mx-auto flex items-center space-x-2 text-red-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tracking Result View */}
      {trackingData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-amber-50">
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase">Order ID</span>
              <p className="text-xl font-black text-amber-600">#{trackingData.orderId}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Current Stage</span>
              <p className="text-sm font-black text-stone-900">
                {trackingData.orderStatus.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          <OrderTimeline
            currentStatus={trackingData.orderStatus}
            history={trackingData.statusHistory}
          />
        </div>
      )}
    </div>
  );
};
