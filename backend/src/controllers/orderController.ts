import { Response, NextFunction } from 'express';
import { Order } from '../models';
import { orderService } from '../services/orderService';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { AuthenticatedRequest } from '../middleware/auth';

export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;
    const order = await orderService.createOrder({
      userId: req.user!.id,
      shippingAddress,
      paymentMethod,
      notes,
    });
    sendSuccess(res, order, 'Order placed successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find({ customer: req.user!.id }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments({ customer: req.user!.id }),
    ]);

    sendSuccess(res, orders, undefined, 200, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    // Allow lookup by Mongo _id or human-readable orderId
    const query = id.startsWith('MP') ? { orderId: id } : { _id: id };
    const order = await Order.findOne({ ...query, customer: req.user!.id });
    if (!order) throw new NotFoundError('Order not found');

    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

export const trackOrderPublic = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId: orderId.toUpperCase() });
    if (!order) throw new NotFoundError('Order not found');

    // Return sanitized tracking view
    sendSuccess(res, {
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
      itemsCount: order.items.length,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelMyOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const order = await orderService.cancelOrderByCustomer(id, req.user!.id, reason);
    sendSuccess(res, order, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
};
