import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController';
import { authenticate, requireCustomer } from '../middleware/auth';
import { addToCartValidator, updateCartItemValidator, removeCartItemValidator } from '../validators/cartValidator';
import { validate } from '../middleware/validation';

const router = Router();

router.use(authenticate, requireCustomer);

router.get('/', getCart);
router.post('/add', addToCartValidator, validate, addToCart);
router.put('/update', updateCartItemValidator, validate, updateCartItem);
router.delete('/remove/:productId', removeCartItemValidator, validate, removeCartItem);
router.delete('/clear', clearCart);

export default router;
