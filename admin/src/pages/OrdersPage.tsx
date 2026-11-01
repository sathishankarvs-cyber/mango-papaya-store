import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Filter, DollarSign, Clock } from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!statusFilter) return true;
    return o.orderStatus === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Order Management</h1>
          <p className="text-slate-400 mt-1">Track and manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-3 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search order ID or customer name..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <button className="px-5 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white flex items-center space-x-2 hover:bg-slate-800 transition-colors">
          <Filter className="w-5 h-5" />
          Status Filter
        </button>
        <button className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          Revenue
        </button>
      </div>

      {/* Orders List */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800/60">
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Order ID</th>
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Payment</th>
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-5 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-5 py-8 text-center">
                  <p className="text-slate-500">No orders found</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: Order) => (
                <tr key={order._id} className="hover:bg-slate-800/40 transition-colors cursor-pointer" onClick={() => {}}>
                  <td className="px-5 py-4 text-white font-medium">{order.orderId}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                        {order.customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-slate-300">{order.customer.name}</p>
                        <p className="text-xs text-slate-500">{order.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right text-white font-medium">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.paymentMethod === 'ONLINE' ? 'bg-green-500/20 text-green-400 border-green-500/25' : 'bg-amber-500/20 text-amber-400 border-amber-500/25'}`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.orderStatus} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link to={`/orders/${order._id}`} className="text-amber-400 hover:text-amber-300 flex items-center space-x-1">
                      View Details <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};