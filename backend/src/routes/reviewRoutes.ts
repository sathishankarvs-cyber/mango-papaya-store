import { Router } from 'express';
import { getProductReviews, addReview } from '../controllers/reviewController';
import { authenticate, requireCustomer } from '../middleware/auth';

const router = Router();

router.get('/:productId', getProductReviews);
router.post('/:productId', authenticate, requireCustomer, addReview);

export default router;
