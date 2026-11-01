import mongoose, { Document, Schema } from 'mongoose';

export type ProductCategory = 'MANGO' | 'PAPAYA';
export type StockStatus = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'SEASONAL_UNAVAILABLE';

export interface INutritionalInfo {
  calories: string;
  carbohydrates: string;
  protein: string;
  fat: string;
  fiber: string;
  vitaminC: string;
  [key: string]: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  productId: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  discountPrice?: number;
  unit: string;
  availableQuantity: number;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  stockStatus: StockStatus;
  isSeasonallyAvailable: boolean;
  seasonalMessage?: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  nutritionalInformation: INutritionalInfo;
  origin: string;
  vectorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NutritionalInfoSchema = new Schema<INutritionalInfo>(
  {
    calories: { type: String, default: '' },
    carbohydrates: { type: String, default: '' },
    protein: { type: String, default: '' },
    fat: { type: String, default: '' },
    fiber: { type: String, default: '' },
    vitaminC: { type: String, default: '' },
  },
  { strict: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    productId: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: { type: String, enum: ['MANGO', 'PAPAYA'], required: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    unit: { type: String, default: 'kg' },
    availableQuantity: { type: Number, required: true, min: 0, default: 0 },
    minimumOrderQuantity: { type: Number, default: 0.5, min: 0 },
    maximumOrderQuantity: { type: Number, default: 20 },
    stockStatus: {
      type: String,
      enum: ['AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'SEASONAL_UNAVAILABLE'],
      default: 'AVAILABLE',
      index: true,
    },
    isSeasonallyAvailable: { type: Boolean, default: true },
    seasonalMessage: { type: String },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    nutritionalInformation: { type: NutritionalInfoSchema, default: {} },
    origin: { type: String, default: 'India' },
    vectorId: { type: String },
  },
  { timestamps: true }
);

// Auto-compute productId before saving
ProductSchema.pre('save', function (next) {
  if (!this.productId) {
    this.productId = `PROD-${this.category}-${Date.now()}`;
  }
  // Auto-update stockStatus based on quantity and seasonal availability
  if (!this.isSeasonallyAvailable) {
    this.stockStatus = 'SEASONAL_UNAVAILABLE';
  } else if (this.availableQuantity <= 0) {
    this.stockStatus = 'OUT_OF_STOCK';
  } else if (this.availableQuantity <= 10) {
    this.stockStatus = 'LOW_STOCK';
  } else {
    this.stockStatus = 'AVAILABLE';
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
