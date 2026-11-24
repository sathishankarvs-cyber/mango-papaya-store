import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Image, AlertCircle, Upload, Trash2, Package } from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';

interface ProductFormPageProps {}
export const ProductFormPage: React.FC<ProductFormPageProps> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

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

    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Price must be a valid number of 0 or greater.');
      setSaving(false);
      return;
    }

    let parsedDiscountPrice: number | null = null;
    if (form.discountPrice !== '' && form.discountPrice !== null && form.discountPrice !== undefined) {
      parsedDiscountPrice = Number(form.discountPrice);
      if (isNaN(parsedDiscountPrice) || parsedDiscountPrice < 0) {
        setError('Discount Price cannot be negative. If there is no discount, please leave it empty or 0.');
        setSaving(false);
        return;
      }
      if (parsedDiscountPrice >= priceNum) {
        setError(`Discount Price (₹${parsedDiscountPrice}) must be lower than the regular Price (₹${priceNum}).`);
        setSaving(false);
        return;
      }
    }

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug ? form.slug.trim().toLowerCase().replace(/\s+/g, '-') : undefined,
        category: form.category,
        description: form.description,
        shortDescription: form.shortDescription,
        price: priceNum,
        discountPrice: parsedDiscountPrice,
        unit: form.unit || 'kg',
        availableQuantity: Number(form.availableQuantity || 0),
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
      if (err.response?.data) {
        const { message, error: detailedError } = err.response.data;
        if (Array.isArray(detailedError) && detailedError.length > 0) {
          const detailMsgs = detailedError
            .map((e: any) => `${e.field ? `${e.field}: ` : ''}${e.message}`)
            .join(' | ');
          setError(`${message || 'Validation failed'}: ${detailMsgs}`);
        } else if (typeof detailedError === 'string') {
          setError(detailedError);
        } else if (message) {
          setError(message);
        } else {
          setError('Failed to save product');
        }
      } else {
        setError(err.message || 'Failed to save product');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    if (form.images.includes(url)) {
      setError('This image URL has already been added.');
      return;
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageUrlInput('');
    setError('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const res = await api.post('/admin/products/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrls: string[] = res.data.data?.imageUrls || [];
      if (uploadedUrls.length > 0) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image file');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
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
                  min="0"
                  step="any"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Discount Price (₹) <span className="text-xs text-slate-400 font-normal">(Optional, must be &gt;= 0)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.discountPrice}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Leave empty or >= 0"
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
                  min="0"
                  step="1"
                  value={form.availableQuantity}
                  onChange={(e) => setForm({ ...form, availableQuantity: e.target.value })}
                  className="w-full pl-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g. 100"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Min Order Qty</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
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
                  min="1"
                  step="any"
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
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <label className="block text-sm font-medium text-slate-300">
                Product Images <span className="text-xs text-slate-400 font-normal">({form.images.length} added)</span>
              </label>
              <span className="text-xs text-amber-400/90">First image will be the primary storefront cover</span>
            </div>

            {/* Input Options: URL + Computer File Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Direct Image URL */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="url"
                    placeholder="Paste direct image URL (https://...)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add URL</span>
                </button>
              </div>

              {/* Option 2: Upload File From Device */}
              <div>
                <label className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-700 hover:border-amber-500/70 bg-slate-800/40 hover:bg-slate-800/80 cursor-pointer transition-all ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-sm text-slate-300">
                    {uploadingImage ? 'Uploading image...' : 'Upload from Computer (JPG, PNG, WebP)'}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    disabled={uploadingImage}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Thumbnail Preview Gallery */}
            {form.images.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-800 rounded-xl text-center bg-slate-900/40">
                <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No images added for this product yet.</p>
                <p className="text-xs text-slate-500 mt-1">Upload an image file above or paste a direct image URL.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800/90 shadow-sm flex flex-col">
                    <div className="relative h-28 bg-slate-950 flex items-center justify-center overflow-hidden">
                      <img
                        src={img}
                        alt={`Product image ${i + 1}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23888" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                        }}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-md shadow">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg opacity-90 group-hover:opacity-100 transition-opacity shadow"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-2 text-[11px] text-slate-400 truncate bg-slate-900 border-t border-slate-800" title={img}>
                      {img.startsWith('/uploads/') ? '📁 Uploaded Image' : img}
                    </div>
                  </div>
                ))}
              </div>
            )}
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