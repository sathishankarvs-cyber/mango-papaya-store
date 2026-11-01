import { Response, NextFunction } from 'express';
import { User, Order } from '../../models';
import { AuthenticatedRequest } from '../../middleware/auth';
import { sendSuccess } from '../../utils/response';
import { NotFoundError } from '../../utils/errors';

export const getAllCustomers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, unknown> = { role: 'customer' };

    if (search && typeof search === 'string') {
      filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { phone: new RegExp(search, 'i') }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    // Calculate metrics for each customer
    const userIds = users.map((u) => u._id);
    const orderAgg = await Order.aggregate([
      { $match: { customer: { $in: userIds }, orderStatus: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: '$customer',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
        },
      },
    ]);

    const statsMap = new Map(orderAgg.map((o) => [o._id.toString(), o]));

    const enriched = users.map((u) => {
      const stats = statsMap.get(u._id.toString());
      return {
        ...u.toJSON(),
        totalOrders: stats?.totalOrders || 0,
        totalSpent: stats?.totalSpent || 0,
      };
    });

    sendSuccess(res, enriched, undefined, 200, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await User.findById(id);
    if (!customer) throw new NotFoundError('Customer not found');

    const orders = await Order.find({ customer: id }).sort({ createdAt: -1 });
    sendSuccess(res, { customer, orders });
  } catch (error) {
    next(error);
  }
};

export const toggleCustomerStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await User.findById(id);
    if (!customer) throw new NotFoundError('Customer not found');

    customer.isActive = !customer.isActive;
    await customer.save();

    sendSuccess(res, customer, `Customer account ${customer.isActive ? 'activated' : 'deactivated'}`);
  } catch (error) {
    next(error);
  }
};
