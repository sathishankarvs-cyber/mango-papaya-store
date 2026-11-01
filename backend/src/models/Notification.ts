import mongoose, { Document, Schema } from 'mongoose';

export type NotificationChannel = 'EMAIL' | 'WHATSAPP' | 'SMS' | 'IN_APP';
export type NotificationType =
  | 'ORDER_PLACED'
  | 'ORDER_CONFIRMED'
  | 'ORDER_PROCESSING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'ORDER_CANCELLED'
  | 'LOW_STOCK_ALERT'
  | 'WELCOME'
  | 'PASSWORD_RESET';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  recipientUser?: mongoose.Types.ObjectId;
  recipientAdmin?: mongoose.Types.ObjectId;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: NotificationChannel;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  status: 'PENDING' | 'SENT' | 'FAILED';
  error?: string;
  sentAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientUser: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    recipientAdmin: { type: Schema.Types.ObjectId, ref: 'Admin', index: true },
    recipientEmail: { type: String, trim: true },
    recipientPhone: { type: String, trim: true },
    channel: { type: String, enum: ['EMAIL', 'WHATSAPP', 'SMS', 'IN_APP'], required: true },
    type: {
      type: String,
      enum: [
        'ORDER_PLACED',
        'ORDER_CONFIRMED',
        'ORDER_PROCESSING',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'ORDER_CANCELLED',
        'LOW_STOCK_ALERT',
        'WELCOME',
        'PASSWORD_RESET',
      ],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING', index: true },
    error: { type: String },
    sentAt: { type: Date },
    readAt: { type: Date },
  },
  { timestamps: true }
);

NotificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
