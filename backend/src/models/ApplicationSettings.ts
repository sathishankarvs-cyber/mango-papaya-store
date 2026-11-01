import mongoose, { Document, Schema } from 'mongoose';

export interface IApplicationSettings extends Document {
  _id: mongoose.Types.ObjectId;
  storeName: string;
  storeTagline: string;
  storeLogoUrl: string;
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
  smsNotificationsEnabled: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const ApplicationSettingsSchema = new Schema<IApplicationSettings>(
  {
    storeName: { type: String, default: 'PSN Farm Pure Mango & Papaya', trim: true },
    storeTagline: { type: String, default: 'Farm Fresh Tropical Delights Directly to Your Doorstep', trim: true },
    storeLogoUrl: { type: String, default: '' },
    contactEmail: { type: String, default: 'support@mangopapaya.store', trim: true },
    contactPhone: { type: String, default: '+91 98765 43210', trim: true },
    storeAddress: { type: String, default: 'Orchard Valley, Fresh Agro Farms, India' },
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
    defaultDeliveryFee: { type: Number, default: 50, min: 0 },
    freeDeliveryThreshold: { type: Number, default: 500, min: 0 },
    minOrderAmount: { type: Number, default: 100, min: 0 },
    lowStockThreshold: { type: Number, default: 10, min: 0 },
    businessHours: { type: String, default: '8:00 AM - 8:00 PM (All Days)' },
    isStoreOpen: { type: Boolean, default: true },
    storeClosedMessage: { type: String, default: 'We are currently closed for dispatch. Orders will be processed next morning.' },
    mangoSeasonalAvailable: { type: Boolean, default: true },
    mangoSeasonalMessage: { type: String, default: 'Mangoes are currently in prime harvest season.' },
    papayaSeasonalAvailable: { type: Boolean, default: true },
    papayaSeasonalMessage: { type: String, default: 'Papayas are freshly harvested all year round.' },
    enableCod: { type: Boolean, default: true },
    enableOnlinePayment: { type: Boolean, default: true },
    whatsappNotificationsEnabled: { type: Boolean, default: true },
    emailNotificationsEnabled: { type: Boolean, default: true },
    smsNotificationsEnabled: { type: Boolean, default: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

export const ApplicationSettings = mongoose.model<IApplicationSettings>('ApplicationSettings', ApplicationSettingsSchema);
