import { body, param } from 'express-validator';

export const createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category')
    .trim()
    .toUpperCase()
    .isIn(['MANGO', 'PAPAYA'])
    .withMessage('Category must be MANGO or PAPAYA'),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discountPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Discount price must be a positive number'),
  body('unit').optional().trim().notEmpty().withMessage('Unit is required (e.g. kg, piece)'),
  body('availableQuantity')
    .isInt({ min: 0 })
    .withMessage('Available quantity must be non-negative integer'),
  body('minimumOrderQuantity').optional().isFloat({ min: 0.1 }),
  body('maximumOrderQuantity').optional().isFloat({ min: 0.1 }),
  body('isSeasonallyAvailable').optional().isBoolean(),
  body('seasonalMessage').optional().trim(),
  body('isFeatured').optional().isBoolean(),
  body('isBestSeller').optional().isBoolean(),
  body('origin').optional().trim(),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
];

export const updateProductValidator = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('slug').optional().trim().notEmpty().withMessage('Slug cannot be empty'),
  body('category').optional().trim().toUpperCase().isIn(['MANGO', 'PAPAYA']).withMessage('Category must be MANGO or PAPAYA'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('shortDescription').optional().trim().notEmpty().withMessage('Short description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number (0 or greater)'),
  body('discountPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Discount price must be a non-negative number (0 or greater)'),
  body('unit').optional().trim().notEmpty().withMessage('Unit cannot be empty'),
  body('availableQuantity').optional().isInt({ min: 0 }).withMessage('Available quantity must be 0 or greater'),
  body('minimumOrderQuantity').optional().isFloat({ min: 0.1 }).withMessage('Minimum order quantity must be at least 0.1'),
  body('maximumOrderQuantity').optional().isFloat({ min: 0.1 }).withMessage('Maximum order quantity must be at least 0.1'),
  body('isSeasonallyAvailable').optional().isBoolean(),
  body('seasonalMessage').optional().trim(),
  body('isFeatured').optional().isBoolean(),
  body('isBestSeller').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('origin').optional().trim(),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

export const updateInventoryValidator = [
  param('productId').isMongoId().withMessage('Invalid product ID'),
  body('totalQuantity').isInt({ min: 0 }).withMessage('Total quantity must be a non-negative integer'),
  body('lowStockThreshold').optional().isInt({ min: 1 }),
  body('reason').optional().trim(),
];
