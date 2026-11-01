import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getMangoProducts,
  getPapayaProducts,
  getRecommendations,
  getFeaturedProducts,
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/mango', getMangoProducts);
router.get('/papaya', getPapayaProducts);
router.get('/featured', getFeaturedProducts);
router.get('/recommendations/:productId', getRecommendations);
router.get('/:slug', getProductBySlug);

export default router;
