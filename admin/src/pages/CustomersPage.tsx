import React, { useEffect, useState } from 'react';
import { Search, Users, AlertCircle, Phone, Mail } from 'lucide-react';
import api from '../services/api';
import { Customer } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/admin/customers');
      setCustomers(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/admin/customers/${id}/toggle`);
      fetchCustomers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to toggle customer status');
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Management</h1>
          <p className="text-slate-400 mt-1">Manage registered customers and their accounts</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800/60">
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Contact</th>
              <th className="px-5 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Total Orders</th>
              <th className="px-5 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Total Spent</th>
              <th className="px-5 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center">
                  <p className="text-slate-500">No customers found</p>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer: Customer) => (
                <tr key={customer._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{customer.phone || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right text-white font-medium">{customer.totalOrders}</td>
                  <td className="px-5 py-4 text-right text-white font-medium">
                    ₹{customer.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={customer.isActive ? 'AVAILABLE' : 'OUT_OF_STOCK'} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(customer._id, customer.isActive)}
                      className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        customer.isActive
                          ? 'text-red-400 hover:bg-red-500/20 border border-red-500/25'
                          : 'text-amber-400 hover:bg-amber-500/20 border border-amber-500/25'
                      }`}
                    >
                      {customer.isActive ? 'Deactivate' : 'Activate'}
                    </button>
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