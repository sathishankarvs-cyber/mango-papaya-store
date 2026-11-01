import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/my');
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PROCESSING':
      case 'PACKED':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-stone-900">My Order History</h1>
        <p className="text-xs text-stone-500 mt-1">
          Review all your fresh fruit orders and check real-time courier statuses.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-amber-100 animate-pulse space-y-4">
              <div className="h-4 bg-amber-100 rounded w-1/4" />
              <div className="h-6 bg-amber-50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-amber-100 p-8 space-y-4">
          <Package className="w-16 h-16 text-amber-400 mx-auto" />
          <h3 className="text-xl font-bold text-stone-900">No orders placed yet</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Experience our handpicked tree-ripened Mangoes & Papayas today!
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-full shadow-md"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm hover:fruit-shadow transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-50">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase">Order ID</span>
                  <p className="font-black text-base text-stone-900">#{order.orderId}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase">Placed On</span>
                  <p className="text-xs font-semibold text-stone-700">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase">Total Amount</span>
                  <p className="font-black text-base text-stone-900">₹{order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Items List Snapshot */}
              <div className="flex items-center space-x-3 overflow-x-auto py-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-amber-50/50 px-3 py-1.5 rounded-xl border border-amber-100 shrink-0 text-xs">
                    <span>{item.category === 'MANGO' ? '🥭' : '🍈'}</span>
                    <span className="font-bold text-stone-800">{item.name}</span>
                    <span className="text-stone-500 font-medium">({item.quantity} {item.unit})</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-stone-500">
                  Payment: <span className="font-bold text-stone-800">{order.paymentMethod}</span> ({order.paymentStatus})
                </p>
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
                >
                  <span>View Details & Tracking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
