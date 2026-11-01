import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { User, Admin } from '../models';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'customer' | 'admin' | 'superadmin';
  };
  adminDoc?: InstanceType<typeof Admin>;
  userDoc?: InstanceType<typeof User>;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const decoded: JwtPayload = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired authentication session'));
  }
};

export const requireCustomer = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'customer') {
      throw new ForbiddenError('Customer access required');
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User account is inactive or not found');
    }

    req.userDoc = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
      throw new ForbiddenError('Admin privileges required');
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.isActive) {
      throw new ForbiddenError('Admin account inactive or not found');
    }

    req.adminDoc = admin;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      req.user = decoded;
    }
  } catch {
    // Ignore error for optional auth
  }
  next();
};
