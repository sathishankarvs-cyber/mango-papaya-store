import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Clock, AlertCircle, CheckCircle2, Truck, DollarSign, Mail, Phone } from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  const fetchOrder = async (orderId: string) => {
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!newStatus || !id) return;
    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus });
      fetchOrder(id);
      setNewStatus('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Order not found</h2>
        <Link to="/orders" className="text-amber-400 mt-2 inline-block">Back to Orders</Link>
      </div>
    );
  }

  const statusColorMap: Record<string, string> = {
    PLACED: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-amber-100 text-amber-800',
    PROCESSING: 'bg-amber-100 text-amber-800',
    PACKED: 'bg-amber-100 text-amber-800',
    OUT_FOR_DELIVERY: 'bg-amber-100 text-amber-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/orders" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Orders</span>
        </Link>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-white">Order {order.orderId}</h1>
          <StatusBadge status={order.orderStatus} size="lg" />
        </div>
      </div>

      {/* Order Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase font-semibold">Customer</p>
          <div className="mt-2 space-y-1">
            <p className="text-lg font-bold text-white">{order.customer.name}</p>
            <p className="text-sm text-slate-400">{order.customer.email}</p>
            <p className="text-sm text-slate-400">{order.customer.phone}</p>
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase font-semibold">Payment</p>
          <div className="mt-2 space-y-1">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.paymentMethod === 'ONLINE' ? 'bg-green-500/20 text-green-400 border-green-500/25' : 'bg-amber-500/20 text-amber-400 border-amber-500/25'}`}>
              {order.paymentMethod}
            </span>
            <p className="text-sm text-slate-400 mt-2">{order.paymentStatus}</p>
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase font-semibold">Total Amount</p>
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">₹{order.totalAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>
            <span className="text-xs text-slate-500">{order.items.length} items</span>
          </div>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.product} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                    <Package className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.quantity} x {item.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">₹{item.subtotal.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Truck className="w-5 h-5" />
            Shipping Address
          </h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p className="flex items-center space-x-2">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          Update Order Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-semibold">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Select status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="PACKED">Packed</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <button
            onClick={updateStatus}
            disabled={!newStatus}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Status
          </button>
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            Status History
          </h2>
          <div className="space-y-3">
            {order.statusHistory.slice().reverse().map((entry, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl border-l-3 border-amber-500/50">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                  {entry.status.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-300 font-medium">{entry.status}</p>
                  <p className="text-xs text-slate-500">{entry.message}</p>
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};