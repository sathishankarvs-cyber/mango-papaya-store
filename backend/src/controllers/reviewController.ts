import { Request, Response, NextFunction } from 'express';
import { Review, Product, Order } from '../models';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/response';
import { BadRequestError } from '../utils/errors';

export const getProductReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId, isApproved: true }).sort({ createdAt: -1 });
    sendSuccess(res, reviews);
  } catch (error) {
    next(error);
  }
};

export const addReview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new BadRequestError('Product not found');

    // Check if verified purchase
    const hasOrdered = await Order.exists({
      customer: req.user!.id,
      'items.product': product._id,
      orderStatus: 'DELIVERED',
    });

    const review = new Review({
      product: product._id,
      user: req.user!.id,
      userName: req.userDoc?.name || 'Verified Customer',
      rating: Number(rating),
      comment,
      isVerifiedPurchase: !!hasOrdered,
      isApproved: true,
    });

    await review.save();

    // Recalculate product rating
    const allReviews = await Review.find({ product: product._id, isApproved: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    product.rating = Number(avgRating.toFixed(1));
    product.reviewCount = allReviews.length;
    await product.save();

    sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};
