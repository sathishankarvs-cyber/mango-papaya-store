import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Image, AlertCircle, Mail, Phone, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';

interface ProductFormPageProps {}
export const ProductFormPage: React.FC<ProductFormPageProps> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'MANGO' as 'MANGO' | 'PAPAYA',
    shortDescription: '',
    description: '',
    price: '',
    discountPrice: '',
    unit: 'kg',
    availableQuantity: '',
    minimumOrderQuantity: '',
    maximumOrderQuantity: '',
    isSeasonallyAvailable: true,
    seasonalMessage: '',
    isFeatured: false,
    isBestSeller: false,
    tags: '',
    origin: '',
    images: [] as string[],
    nutritionalInformation: {},
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchProduct(id);
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const res = await api.get(`/admin/products/${productId}`);
      const product: Product = res.data.data;
      setForm({
        name: product.name,
        slug: product.slug,
        category: product.category as 'MANGO' | 'PAPAYA',
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price.toString(),
        discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
        unit: product.unit,
        availableQuantity: product.availableQuantity.toString(),
        minimumOrderQuantity: product.minimumOrderQuantity.toString(),
        maximumOrderQuantity: product.maximumOrderQuantity.toString(),
        isSeasonallyAvailable: product.isSeasonallyAvailable,
        seasonalMessage: product.seasonalMessage || '',
        isFeatured: product.isFeatured,
        isBestSeller: product.isBestSeller,
        tags: product.tags?.join(', '),
        origin: product.origin || '',
        images: product.images || [],
        nutritionalInformation: product.nutritionalInformation || {},
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        category: form.category,
        description: form.description,
        shortDescription: form.shortDescription,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        unit: form.unit,
        availableQuantity: Number(form.availableQuantity),
        minimumOrderQuantity: Number(form.minimumOrderQuantity || 1),
        maximumOrderQuantity: Number(form.maximumOrderQuantity || 20),
        isSeasonallyAvailable: form.isSeasonallyAvailable,
        seasonalMessage: form.seasonalMessage || undefined,
        isFeatured: form.isFeatured,
        isBestSeller: form.isBestSeller,
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        nutritionalInformation: form.nutritionalInformation,
        origin: form.origin || 'India',
        images: form.images,
      };

      if (id && id !== 'new') {
        await api.put(`/admin/products/${id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }

      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const addImage = (url: string) => {
    if (url && !form.images.includes(url)) {
      setForm({ ...form, images: [...form.images, url] });
    }
  };

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/products" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-2xl font-bold text-white">{id && id !== 'new' ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="alphonso-mango"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as 'MANGO' | 'PAPAYA' })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="MANGO">Mango</option>
                  <option value="PAPAYA">Papaya</option>
                </select>
              </div>
            </div>

            {/* Middle Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Discount Price (₹)</label>
                <input
                  type="number"
                  value={form.discountPrice}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Unit</label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="kg"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Available Quantity</label>
                <input
                  type="number"
                  value={form.availableQuantity}
                  onChange={(e) => setForm({ ...form, availableQuantity: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g. 100 kg"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Min Order Qty</label>
                <input
                  type="number"
                  value={form.minimumOrderQuantity}
                  onChange={(e) => setForm({ ...form, minimumOrderQuantity: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Max Order Qty</label>
                <input
                  type="number"
                  value={form.maximumOrderQuantity}
                  onChange={(e) => setForm({ ...form, maximumOrderQuantity: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="20"
                />
              </div>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Short Description</label>
            <textarea
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              rows={3}
              className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Short catchy description..."
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Full Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Detailed product description..."
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Product Images</label>
            <div className="flex items-center space-x-4 max-w-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Image URL..."
                  value=""
                  onFocus={(e) => {
                    // handle paste/add
                  }}
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
              <button
                onClick={() => addImage(window.prompt('Enter image URL:') || '')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-sm font-medium transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((img, i) => (
                <div key={i} className="flex items-center space-x-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-200 text-sm">
                  <span>{img.length > 40 ? img.slice(0, 40) + '...' : img}</span>
                  <button onClick={() => removeImage(i)} className="p-1 hover:bg-red-500/20 rounded">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags & Origin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="sweet, alphonso, mango"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Origin</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ratnagiri, Maharashtra"
              />
            </div>
          </div>

          {/* Feature Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.isSeasonallyAvailable}
                onChange={(e) => setForm({ ...form, isSeasonallyAvailable: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Seasonally Available</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Featured Product</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Best Seller</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : id && id !== 'new' ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};