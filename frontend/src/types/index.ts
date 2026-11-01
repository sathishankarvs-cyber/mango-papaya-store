export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'superadmin';
}

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export type ProductCategory = 'MANGO' | 'PAPAYA';
export type StockStatus = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'SEASONAL_UNAVAILABLE';

export interface Product {
  _id: string;
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
  rating: number;
  reviewCount: number;
  tags: string[];
  nutritionalInformation?: Record<string, string>;
  origin: string;
}

export interface CartItem {
  product: string | Product;
  name: string;
  image: string;
  category: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  unit: string;
  subtotal: number;
}

export interface Cart {
  _id?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  message: string;
  timestamp: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customer: string | User;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: 'COD' | 'ONLINE';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  notes?: string;
  cancelReason?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  product: string;
  userName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}
