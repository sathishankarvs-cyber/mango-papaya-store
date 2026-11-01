import { body } from 'express-validator';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Please provide a valid phone number'),
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const adminLoginValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid admin email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const forgotPasswordValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 100 }),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Please provide a valid phone number'),
];
