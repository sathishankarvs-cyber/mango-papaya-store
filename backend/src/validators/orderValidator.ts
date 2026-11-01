import { body, param } from 'express-validator';

export const createOrderValidator = [
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
  body('shippingAddress.addressLine1').trim().notEmpty().withMessage('Address line 1 is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('paymentMethod').optional().isIn(['COD', 'ONLINE']).withMessage('Payment method must be COD or ONLINE'),
  body('notes').optional().trim(),
];

export const updateOrderStatusValidator = [
  param('id').isMongoId().withMessage('Valid order ID is required'),
  body('status')
    .isIn(['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid order status'),
  body('message').optional().trim(),
];

export const cancelOrderValidator = [
  param('id').isMongoId().withMessage('Valid order ID is required'),
  body('reason').optional().trim(),
];
