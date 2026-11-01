import React, { useEffect, useState } from 'react';
import { Plus, Trash2, MapPin, Check, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { Address } from '../types';

export const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Add form fields
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/addresses');
      setAddresses(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      const res = await api.post('/users/addresses', {
        label,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state: stateName,
        pincode,
        country: 'India',
        isDefault,
      });
      if (res.data?.data) {
        setShowAddModal(false);
        fetchAddresses();
        // Reset form
        setFullName('');
        setPhone('');
        setAddressLine1('');
        setAddressLine2('');
        setCity('');
        setPincode('');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/users/addresses/${id}`);
      setAddresses(addresses.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.put(`/users/addresses/${id}`, { isDefault: true });
      fetchAddresses();
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Saved Addresses</h1>
          <p className="text-xs text-stone-500 mt-1">Manage delivery locations for swift fruit checkout.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-amber-100 animate-pulse h-40" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-amber-100 p-8 space-y-3">
          <MapPin className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-stone-900">No saved addresses yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Add your primary residential or office delivery address to speed up your future orders.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-full shadow-md"
          >
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all space-y-3 relative shadow-sm ${
                addr.isDefault ? 'border-amber-500 bg-amber-50/20' : 'border-stone-100 hover:border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {addr.label}
                </span>
                {addr.isDefault ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Default</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetDefault(addr._id)}
                    className="text-[11px] font-bold text-stone-500 hover:text-amber-700 hover:underline"
                  >
                    Set as Default
                  </button>
                )}
              </div>

              <div>
                <p className="font-bold text-sm text-stone-900">{addr.fullName}</p>
                <p className="text-xs text-stone-500 font-medium">📱 {addr.phone}</p>
                <p className="text-xs text-stone-700 mt-2">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-xs text-stone-700">{addr.addressLine2}</p>}
                <p className="text-xs text-stone-700">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-50 flex justify-end">
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-amber-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-stone-900">Add New Delivery Location</h3>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Label</label>
                  <select
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl font-bold"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                  placeholder="Flat/House No., Building, Street"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                  placeholder="Landmark, Area"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultCheck"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                />
                <label htmlFor="defaultCheck" className="text-xs font-bold text-stone-700 cursor-pointer">
                  Make this my default shipping address
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
