import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  amount: number;
  method: 'COD' | 'ONLINE';
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  refundAmount?: number;
  refundAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['COD', 'ONLINE'], required: true },
    status: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    transactionId: { type: String },
    gatewayResponse: { type: Schema.Types.Mixed },
    refundAmount: { type: Number },
    refundAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
