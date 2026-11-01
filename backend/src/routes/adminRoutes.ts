import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin/adminDashboardController';
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
} from '../controllers/admin/adminProductController';
import { getInventoryList, updateProductInventory } from '../controllers/admin/adminInventoryController';
import {
  getAllOrdersAdmin,
  getOrderDetailsAdmin,
  updateOrderStatusAdmin,
  cancelOrderAdmin,
} from '../controllers/admin/adminOrderController';
import {
  getAllCustomers,
  getCustomerDetails,
  toggleCustomerStatus,
} from '../controllers/admin/adminCustomerController';
import { getSettings, updateSettings } from '../controllers/admin/adminSettingsController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { uploadProductImage } from '../middleware/upload';
import {
  createProductValidator,
  updateProductValidator,
  updateInventoryValidator,
} from '../validators/productValidator';
import { updateOrderStatusValidator, cancelOrderValidator } from '../validators/orderValidator';
import { updateSettingsValidator } from '../validators/settingsValidator';
import { validate } from '../middleware/validation';

const router = Router();

// Strict RBAC Middleware for all Admin Routes
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Product Management
router.get('/products', getAllProductsAdmin);
router.post('/products', createProductValidator, validate, createProduct);
router.put('/products/:id', updateProductValidator, validate, updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/upload-images', uploadProductImage.array('images', 5), uploadImages);

// Inventory Management
router.get('/inventory', getInventoryList);
router.put('/inventory/:productId', updateInventoryValidator, validate, updateProductInventory);

// Order Management
router.get('/orders', getAllOrdersAdmin);
router.get('/orders/:id', getOrderDetailsAdmin);
router.put('/orders/:id/status', updateOrderStatusValidator, validate, updateOrderStatusAdmin);
router.post('/orders/:id/cancel', cancelOrderValidator, validate, cancelOrderAdmin);

// Customer Management
router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerDetails);
router.put('/customers/:id/toggle', toggleCustomerStatus);

// Application Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettingsValidator, validate, updateSettings);

export default router;
