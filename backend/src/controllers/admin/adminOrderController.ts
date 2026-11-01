import { Response, NextFunction } from 'express';
import { Order } from '../../models';
import { AuthenticatedRequest } from '../../middleware/auth';
import { orderService } from '../../services/orderService';
import { sendSuccess } from '../../utils/response';
import { NotFoundError } from '../../utils/errors';

export const getAllOrdersAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && typeof status === 'string') {
      filter.orderStatus = status;
    }
    if (search && typeof search === 'string') {
      filter.$or = [
        { orderId: new RegExp(search, 'i') },
        { 'shippingAddress.fullName': new RegExp(search, 'i') },
        { 'shippingAddress.phone': new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
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

export const getOrderDetailsAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('customer', 'name email phone');
    if (!order) throw new NotFoundError('Order not found');
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    const order = await orderService.updateOrderStatus({
      orderId: id,
      status,
      message,
      adminId: req.adminDoc!._id,
    });

    sendSuccess(res, order, `Order status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

export const cancelOrderAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await orderService.updateOrderStatus({
      orderId: id,
      status: 'CANCELLED',
      message: reason || 'Order cancelled by store administrator',
      adminId: req.adminDoc!._id,
    });

    sendSuccess(res, order, 'Order cancelled and stock restored');
  } catch (error) {
    next(error);
  }
};
