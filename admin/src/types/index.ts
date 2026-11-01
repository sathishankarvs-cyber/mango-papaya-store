export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
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
  isActive: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  nutritionalInformation?: Record<string, string>;
  origin: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  product: Product;
  inventory: {
    _id?: string;
    totalQuantity: number;
    reservedQuantity: number;
    soldQuantity: number;
    availableQuantity: number;
    lowStockThreshold: number;
    logs?: Array<{
      action: string;
      quantity: number;
      reason: string;
      timestamp: string;
    }>;
  };
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  _id: string;
  orderId: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    product: string;
    name: string;
    image: string;
    category: string;
    price: number;
    discountPrice?: number;
    quantity: number;
    unit: string;
    subtotal: number;
  }>;
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
  statusHistory: Array<{
    status: OrderStatus;
    message: string;
    timestamp: string;
  }>;
  notes?: string;
  createdAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastLogin?: string;
}

export interface ApplicationSettings {
  _id?: string;
  storeName: string;
  storeTagline: string;
  contactEmail: string;
  contactPhone: string;
  storeAddress: string;
  currency: string;
  currencySymbol: string;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  lowStockThreshold: number;
  businessHours: string;
  isStoreOpen: boolean;
  storeClosedMessage: string;
  mangoSeasonalAvailable: boolean;
  mangoSeasonalMessage: string;
  papayaSeasonalAvailable: boolean;
  papayaSeasonalMessage: string;
  enableCod: boolean;
  enableOnlinePayment: boolean;
  whatsappNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
}

export interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  orderStatuses: {
    pending: number;
    processing: number;
    outForDelivery: number;
    delivered: number;
    cancelled: number;
  };
  stockSummary: {
    mangoStock: number;
    papayaStock: number;
    totalStock: number;
  };
  recentOrders: Order[];
  lowStockProducts: Product[];
  recentNotifications: Array<{
    _id: string;
    channel: string;
    type: string;
    title: string;
    message: string;
    status: string;
    createdAt: string;
  }>;
}
