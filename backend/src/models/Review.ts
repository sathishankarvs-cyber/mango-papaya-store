import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
