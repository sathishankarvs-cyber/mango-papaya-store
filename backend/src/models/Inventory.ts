import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryLog {
  action: 'ADD' | 'SUBTRACT' | 'RESERVE' | 'RELEASE' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  orderId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
  timestamp: Date;
}

export interface IInventory extends Document {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  totalQuantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  logs: IInventoryLog[];
  updatedAt: Date;
}

const InventoryLogSchema = new Schema<IInventoryLog>({
  action: { type: String, enum: ['ADD', 'SUBTRACT', 'RESERVE', 'RELEASE', 'ADJUSTMENT'], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
  timestamp: { type: Date, default: Date.now },
});

const InventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, unique: true, index: true },
    totalQuantity: { type: Number, default: 0, min: 0 },
    reservedQuantity: { type: Number, default: 0, min: 0 },
    soldQuantity: { type: Number, default: 0, min: 0 },
    availableQuantity: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    logs: [InventoryLogSchema],
  },
  { timestamps: true }
);

// Compute availableQuantity before saving
InventorySchema.pre('save', function (next) {
  this.availableQuantity = Math.max(0, this.totalQuantity - this.reservedQuantity);
  next();
});

export const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
