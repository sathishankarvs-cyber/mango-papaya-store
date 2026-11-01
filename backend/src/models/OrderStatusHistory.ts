import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus } from './Order';

export interface IOrderStatusHistory extends Document {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  orderId: string;
  previousStatus?: OrderStatus;
  newStatus: OrderStatus;
  message: string;
  updatedByAdmin?: mongoose.Types.ObjectId;
  updatedByUser?: mongoose.Types.ObjectId;
  source: 'SYSTEM' | 'ADMIN' | 'CUSTOMER';
  createdAt: Date;
}

const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    orderId: { type: String, required: true, index: true },
    previousStatus: { type: String },
    newStatus: { type: String, required: true },
    message: { type: String, required: true },
    updatedByAdmin: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedByUser: { type: Schema.Types.ObjectId, ref: 'User' },
    source: { type: String, enum: ['SYSTEM', 'ADMIN', 'CUSTOMER'], default: 'SYSTEM' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

OrderStatusHistorySchema.index({ order: 1, createdAt: -1 });

export const OrderStatusHistory = mongoose.model<IOrderStatusHistory>('OrderStatusHistory', OrderStatusHistorySchema);
