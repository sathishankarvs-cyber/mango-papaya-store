import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Truck,
  ShieldCheck,
  AlertCircle,
  Star,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import api from '../services/api';
import { Product, Review } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { SeasonalBadge } from '../components/SeasonalBadge';
import { RatingStars } from '../components/RatingStars';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Review Form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.get(`/products/${slug}`);
        const prodData: Product = res.data?.data;
        setProduct(prodData);
        setSelectedImage(prodData.images?.[0] || '');
        setQuantity(prodData.minimumOrderQuantity || 1);

        // Fetch Recommendations & Reviews in parallel
        const [recRes, revRes] = await Promise.all([
          api.get(`/products/recommendations/${prodData._id}`),
          api.get(`/reviews/${prodData._id}`),
        ]);
        setRecommendations(recRes.data?.data || []);
        setReviews(revRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-6 bg-amber-100 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-amber-100 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-amber-100 rounded w-3/4" />
            <div className="h-6 bg-amber-50 rounded w-1/3" />
            <div className="h-24 bg-amber-50 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <span className="text-6xl">🥭</span>
        <h2 className="text-2xl font-bold text-stone-900">Fruit not found</h2>
        <p className="text-sm text-stone-500">The requested harvest product is unavailable or discontinued.</p>
        <Link
          to="/products"
          className="inline-block px-6 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-full shadow-md"
        >
          Browse All Fruits
        </Link>
      </div>
    );
  }

  const isAvailable =
    product.isSeasonallyAvailable &&
    product.availableQuantity > 0 &&
    product.stockStatus !== 'SEASONAL_UNAVAILABLE' &&
    product.stockStatus !== 'OUT_OF_STOCK';

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAvailable) return;

    try {
      setIsAdding(true);
      setErrorMsg('');
      await addItem(product._id, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await api.post(`/reviews/${product._id}`, {
        rating: newRating,
        comment: newComment.trim(),
      });
      if (res.data?.data) {
        setReviews([res.data.data, ...reviews]);
        setNewComment('');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center space-x-2 text-xs font-bold text-stone-600 hover:text-amber-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Fruits</span>
      </Link>

      {/* Main Product Hero / Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery / Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl border border-amber-100 overflow-hidden shadow-sm flex items-center justify-center relative">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!isAvailable && (
              <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] flex items-center justify-center p-6">
                <span className="bg-stone-900/90 text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                  {!product.isSeasonallyAvailable ? 'Seasonal Unavailable' : 'Out of Stock'}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-amber-500 shadow-md ring-2 ring-amber-200' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information & Purchase Area */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                  product.category === 'MANGO' ? 'bg-amber-400 text-amber-950' : 'bg-orange-500 text-white'
                }`}
              >
                {product.category === 'MANGO' ? '🥭 Mango' : '🍈 Papaya'}
              </span>
              <SeasonalBadge
                stockStatus={product.stockStatus}
                isSeasonallyAvailable={product.isSeasonallyAvailable}
                seasonalMessage={product.seasonalMessage}
              />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-3 pt-1">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
              <span className="text-xs text-stone-400">|</span>
              <span className="text-xs font-medium text-stone-500">Origin: {product.origin}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-baseline space-x-3">
            <span className="text-3xl font-black text-stone-900">
              ₹{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-stone-400 line-through font-medium">
                ₹{product.price}
              </span>
            )}
            <span className="text-sm text-stone-600 font-semibold">per {product.unit}</span>
            <span className="text-xs font-bold text-emerald-700 ml-auto bg-emerald-100 px-2.5 py-1 rounded-full">
              In Stock: {product.availableQuantity} {product.unit}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">About This Harvest</h4>
            <p className="text-sm text-stone-700 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Quantity Stepper & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-amber-100">
            {isAvailable ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Stepper */}
                <div className="flex items-center border border-amber-300 bg-white rounded-2xl p-1 shadow-sm w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(Math.max(product.minimumOrderQuantity || 1, quantity - 1))}
                    disabled={quantity <= (product.minimumOrderQuantity || 1)}
                    className="p-2.5 text-stone-600 hover:text-amber-600 disabled:opacity-30 rounded-xl hover:bg-amber-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-black text-base text-stone-900">
                    {quantity} <span className="text-xs text-stone-500 font-normal">{product.unit}</span>
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                    disabled={quantity >= product.availableQuantity}
                    className="p-2.5 text-stone-600 hover:text-amber-600 disabled:opacity-30 rounded-xl hover:bg-amber-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 w-full py-4 px-8 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-orange-500/20'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add {quantity} {product.unit} to Cart (₹{(quantity * (product.discountPrice || product.price)).toFixed(0)})</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                <p className="text-xs font-bold text-amber-900">
                  {product.seasonalMessage || 'This fruit is currently unavailable for harvest orders.'}
                </p>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-red-600 font-bold flex items-center mt-2">
                <AlertCircle className="w-4 h-4 mr-1.5" /> {errorMsg}
              </p>
            )}
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-amber-100 text-xs text-stone-700">
              <Truck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Dispatched within 24h</span>
            </div>
            <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-amber-100 text-xs text-stone-700">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Zero-Carbide Pure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nutritional Information */}
      {product.nutritionalInformation && Object.keys(product.nutritionalInformation).length > 0 && (
        <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-stone-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Nutritional Profile & Health Benefits</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-2">
            {Object.entries(product.nutritionalInformation).map(([key, val]) => (
              <div key={key} className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100 text-center">
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider capitalize">{key}</p>
                <p className="text-sm font-black text-stone-900 mt-1">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vector Recommendations (Semantically Similar Fruits) */}
      {recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-2xl font-black text-stone-900">You May Also Savor</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-stone-900">Customer Reviews</h3>
            <p className="text-xs text-stone-500 mt-0.5">Real feedback from certified orchard buyers</p>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className="p-6 bg-amber-50/40 rounded-2xl border border-amber-100 space-y-4">
          <h4 className="font-bold text-sm text-stone-900">Leave your review</h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-stone-600">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setNewRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your thoughts on the sweetness, fragrance and packaging..."
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3.5 text-xs bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-full shadow-sm disabled:opacity-50"
          >
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-xs text-stone-500 text-center py-6">
            No reviews yet for this harvest. Be the first to share your experience!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl bg-stone-50/60 border border-stone-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-stone-900">{rev.userName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <RatingStars rating={rev.rating} showCount={false} size="sm" />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
