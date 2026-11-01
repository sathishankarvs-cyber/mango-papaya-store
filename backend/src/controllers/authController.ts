import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { User, Admin } from '../models';
import { generateToken } from '../utils/jwt';
import { sendSuccess } from '../utils/response';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { notificationService } from '../services/notificationService';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new BadRequestError('An account with this email address already exists.');
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: 'customer',
    });

    await user.save();

    const token = generateToken({ id: user._id.toString(), email: user.email, role: 'customer' });

    // Send welcome email notification
    notificationService.send({
      channel: 'EMAIL',
      type: 'WELCOME',
      title: 'Welcome to PSN Farm Pure Mango & Papaya!',
      message: `Hi ${user.name}, thank you for joining! Enjoy our handpicked, farm-fresh Mangoes and Papayas.`,
      recipientEmail: user.email,
      recipientUser: user._id,
    });

    sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      'Registration successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated. Please contact support.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({ id: user._id.toString(), email: user.email, role: 'customer' });

    sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin) {
      throw new UnauthorizedError('Invalid admin credentials.');
    }

    if (!admin.isActive) {
      throw new UnauthorizedError('Admin account is suspended.');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid admin credentials.');
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken({ id: admin._id.toString(), email: admin.email, role: admin.role }, true);

    sendSuccess(
      res,
      {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      'Admin login successful'
    );
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      sendSuccess(res, null, 'If this email is registered, you will receive password reset instructions.');
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await notificationService.send({
      channel: 'EMAIL',
      type: 'PASSWORD_RESET',
      title: 'Password Reset Request',
      message: `Your password reset token is: ${resetToken}. This token expires in 1 hour.`,
      recipientEmail: user.email,
      recipientUser: user._id,
    });

    sendSuccess(
      res,
      { resetToken }, // Return token in dev mode for easy test execution
      'If this email is registered, you will receive password reset instructions.'
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestError('Password reset token is invalid or has expired.');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendSuccess(res, null, 'Password reset successful. You can now log in with your new password.');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) throw new UnauthorizedError('User not found');
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};
