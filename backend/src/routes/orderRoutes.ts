import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrderPublic,
  cancelMyOrder,
} from '../controllers/orderController';
import { authenticate, requireCustomer } from '../middleware/auth';
import { createOrderValidator, cancelOrderValidator } from '../validators/orderValidator';
import { validate } from '../middleware/validation';
import { orderLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public / Guest tracking
router.get('/track/:orderId', trackOrderPublic);

// Authenticated Customer endpoints
router.use(authenticate, requireCustomer);
router.post('/', orderLimiter, createOrderValidator, validate, createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrderValidator, validate, cancelMyOrder);

export default router;
