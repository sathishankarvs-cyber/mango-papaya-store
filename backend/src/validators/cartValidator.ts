import { body, param } from 'express-validator';

export const addToCartValidator = [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isFloat({ min: 0.1 }).withMessage('Quantity must be greater than 0'),
];

export const updateCartItemValidator = [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity cannot be negative'),
];

export const removeCartItemValidator = [
  param('productId').isMongoId().withMessage('Valid product ID is required'),
];
