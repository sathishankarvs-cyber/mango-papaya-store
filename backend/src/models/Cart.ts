import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  category: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  unit: string;
  subtotal: number;
}

export interface ICart extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  quantity: { type: Number, required: true, min: 0.1 },
  unit: { type: String, default: 'kg' },
  subtotal: { type: Number, required: true },
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: [CartItemSchema],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
