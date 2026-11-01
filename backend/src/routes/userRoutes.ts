import { Router } from 'express';
import {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/userController';
import { authenticate, requireCustomer } from '../middleware/auth';
import { updateProfileValidator } from '../validators/authValidator';
import { validate } from '../middleware/validation';

const router = Router();

router.use(authenticate, requireCustomer);

router.put('/profile', updateProfileValidator, validate, updateProfile);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;
