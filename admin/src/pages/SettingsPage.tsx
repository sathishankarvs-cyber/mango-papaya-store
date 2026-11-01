import React, { useEffect, useState } from 'react';
import { Shield, Settings as SettingsIcon, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { ApplicationSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ApplicationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      setSettings(res.data.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.put('/admin/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Store Settings</h1>
          <p className="text-slate-400 mt-1">Configure your orchard store settings</p>
        </div>
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all disabled:opacity-50"
          onClick={handleSubmit}
          disabled={saving}
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 text-sm flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Store Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-amber-400" />
              Store Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Store Name</label>
                <input
                  type="text"
                  defaultValue={settings.storeName}
                  name="storeName"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Store Tagline</label>
                <input
                  type="text"
                  defaultValue={settings.storeTagline}
                  name="storeTagline"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Store Address</label>
                <input
                  type="text"
                  defaultValue={settings.storeAddress}
                  name="storeAddress"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Contact Email</label>
                <input
                  type="email"
                  defaultValue={settings.contactEmail}
                  name="contactEmail"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Contact Phone</label>
                <input
                  type="tel"
                  defaultValue={settings.contactPhone}
                  name="contactPhone"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Currency & Payments */}
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2 mb-6">
              <Mail className="w-5 h-5 text-amber-400" />
              Currency & Payment Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Currency</label>
                <input
                  type="text"
                  defaultValue={settings.currency}
                  name="currency"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Currency Symbol</label>
                <input
                  type="text"
                  defaultValue={settings.currencySymbol}
                  name="currencySymbol"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Default Delivery Fee</label>
                <input
                  type="number"
                  defaultValue={settings.defaultDeliveryFee}
                  name="defaultDeliveryFee"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Free Delivery Threshold</label>
                <input
                  type="number"
                  defaultValue={settings.freeDeliveryThreshold}
                  name="freeDeliveryThreshold"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Min Order Amount</label>
                <input
                  type="number"
                  defaultValue={settings.minOrderAmount}
                  name="minOrderAmount"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Low Stock Threshold</label>
                <input
                  type="number"
                  defaultValue={settings.lowStockThreshold}
                  name="lowStockThreshold"
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked={settings.enableCod}
                    name="enableCod"
                    className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Enable COD</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked={settings.enableOnlinePayment}
                    name="enableOnlinePayment"
                    className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Enable Online Payment</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};