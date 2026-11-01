import { body } from 'express-validator';

export const updateSettingsValidator = [
  body('storeName').optional().trim().notEmpty(),
  body('contactEmail').optional().isEmail(),
  body('contactPhone').optional().trim().notEmpty(),
  body('defaultDeliveryFee').optional().isFloat({ min: 0 }),
  body('freeDeliveryThreshold').optional().isFloat({ min: 0 }),
  body('minOrderAmount').optional().isFloat({ min: 0 }),
  body('lowStockThreshold').optional().isInt({ min: 1 }),
  body('mangoSeasonalAvailable').optional().isBoolean(),
  body('mangoSeasonalMessage').optional().trim(),
  body('papayaSeasonalAvailable').optional().isBoolean(),
  body('papayaSeasonalMessage').optional().trim(),
  body('enableCod').optional().isBoolean(),
  body('enableOnlinePayment').optional().isBoolean(),
];
