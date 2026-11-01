import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, Clock, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { DashboardStats, Order } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard/stats');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-3" />
              <div className="h-8 bg-slate-700 rounded w-1/2" />
            </div>
          ))}
        </div>
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/4 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-8 text-center">
        <p className="text-slate-400">Failed to load dashboard data</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const getTrend = (today: number, total: number) => {
    if (total === 0) return { trend: 'neutral' as const, value: '0%' };
    const percent = ((today / total) * 100).toFixed(1);
    return { trend: 'up' as const, value: `${percent}% today` };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here's what's happening with your orchard today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" title="Refresh">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          subtitle={`Today: ${stats.todayOrders}`}
          icon={ShoppingCart}
          trend="up"
          trendValue={`${stats.todayOrders} today`}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Excluding cancelled orders"
          icon={DollarSign}
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          subtitle="Registered users"
          icon={Users}
          trend="up"
          trendValue="+8 this week"
        />
        <StatCard
          title="Total Stock"
          value={`${stats.stockSummary.totalStock} kg`}
          subtitle={`Mango: ${stats.stockSummary.mangoStock} | Papaya: ${stats.stockSummary.papayaStock}`}
          icon={Package}
          trend={stats.stockSummary.totalStock < 100 ? 'down' : 'neutral'}
          trendValue={stats.stockSummary.totalStock < 100 ? 'Low stock!' : 'Healthy'}
        />
      </div>

      {/* Order Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: stats.orderStatuses.pending, icon: Clock, color: 'amber' },
          { label: 'Processing', value: stats.orderStatuses.processing, icon: Package, color: 'blue' },
          { label: 'Out for Delivery', value: stats.orderStatuses.outForDelivery, icon: ArrowUpRight, color: 'purple' },
          { label: 'Delivered', value: stats.orderStatuses.delivered, icon: CheckCircle2, color: 'green' },
          { label: 'Cancelled', value: stats.orderStatuses.cancelled, icon: AlertTriangle, color: 'red' },
        ].map((item) => (
          <Link key={item.label} to={`/orders?status=${item.label.toUpperCase().replace(' ', '_')}`} className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-600/50 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl bg-${item.color}-500/20 text-${item.color}-400`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-2xl font-bold text-slate-100">{item.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-amber-400 hover:text-amber-300 font-medium">View all →</Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No orders yet</p>
            ) : (
              stats.recentOrders.slice(0, 5).map((order: Order) => (
                <Link key={order._id} to={`/orders/${order._id}`} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{order.orderId}</p>
                      <p className="text-xs text-slate-400">{order.customer.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                    <StatusBadge status={order.orderStatus} size="sm" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Low Stock Alerts</span>
            </h2>
            <Link to="/products" className="text-sm text-amber-400 hover:text-amber-300 font-medium">View all →</Link>
          </div>
          <div className="space-y-3">
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-slate-500 text-center py-4">All products well stocked! ✓</p>
            ) : (
              stats.lowStockProducts.slice(0, 5).map((product: any) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{product.name}</p>
                      <p className="text-xs text-slate-400">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={product.stockStatus} size="sm" />
                    <p className="text-xs text-slate-400 mt-0.5">{product.availableQuantity} kg left</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};