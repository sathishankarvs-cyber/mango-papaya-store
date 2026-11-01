import { Router } from 'express';
import {
  register,
  login,
  adminLogin,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/authController';
import {
  registerValidator,
  loginValidator,
  adminLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/authValidator';
import { validate } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/admin/login', authLimiter, adminLoginValidator, validate, adminLogin);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validate, resetPassword);
router.get('/me', authenticate, getMe);

export default router;
