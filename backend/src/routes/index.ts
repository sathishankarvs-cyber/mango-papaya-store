import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';
import searchRoutes from './searchRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import reviewRoutes from './reviewRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/search', searchRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);

export default router;
