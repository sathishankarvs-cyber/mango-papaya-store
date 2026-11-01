import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'ONLINE';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface IOrderItem {
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

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: string;
  customer: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    message: string;
    timestamp: Date;
    updatedBy?: mongoose.Types.ObjectId;
  }>;
  notes?: string;
  cancelReason?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  subtotal: { type: Number, required: true },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    paymentMethod: { type: String, enum: ['COD', 'ONLINE'], default: 'COD' },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    orderStatus: {
      type: String,
      enum: ['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED',
      index: true,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
      },
    ],
    notes: { type: String },
    cancelReason: { type: String },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.pre('save', function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderId = `MP${timestamp}${random}`;
  }
  next();
});

// Indexes for fast queries
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
