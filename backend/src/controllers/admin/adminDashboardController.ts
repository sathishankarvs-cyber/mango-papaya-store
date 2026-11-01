import { Response, NextFunction } from 'express';
import { Order, User, Product, Inventory, Notification } from '../../models';
import { AuthenticatedRequest } from '../../middleware/auth';
import { sendSuccess } from '../../utils/response';

export const getDashboardStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      totalCustomers,
      revenueResult,
      pendingOrders,
      processingOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      mangoStockResult,
      papayaStockResult,
      recentOrders,
      lowStockProducts,
      recentNotifications,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ orderStatus: 'PLACED' }),
      Order.countDocuments({ orderStatus: { $in: ['CONFIRMED', 'PROCESSING', 'PACKED'] } }),
      Order.countDocuments({ orderStatus: 'OUT_FOR_DELIVERY' }),
      Order.countDocuments({ orderStatus: 'DELIVERED' }),
      Order.countDocuments({ orderStatus: 'CANCELLED' }),
      Product.aggregate([
        { $match: { category: 'MANGO', isActive: true } },
        { $group: { _id: null, totalStock: { $sum: '$availableQuantity' } } },
      ]),
      Product.aggregate([
        { $match: { category: 'PAPAYA', isActive: true } },
        { $group: { _id: null, totalStock: { $sum: '$availableQuantity' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(6).populate('customer', 'name email phone'),
      Product.find({ isActive: true, stockStatus: { $in: ['LOW_STOCK', 'OUT_OF_STOCK'] } }).limit(5),
      Notification.find().sort({ createdAt: -1 }).limit(10),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const mangoStock = mangoStockResult[0]?.totalStock || 0;
    const papayaStock = papayaStockResult[0]?.totalStock || 0;

    sendSuccess(res, {
      totalOrders,
      todayOrders,
      totalCustomers,
      totalRevenue,
      orderStatuses: {
        pending: pendingOrders,
        processing: processingOrders,
        outForDelivery: outForDeliveryOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      stockSummary: {
        mangoStock,
        papayaStock,
        totalStock: mangoStock + papayaStock,
      },
      recentOrders,
      lowStockProducts,
      recentNotifications,
    });
  } catch (error) {
    next(error);
  }
};
