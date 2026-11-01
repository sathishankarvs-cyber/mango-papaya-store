import mongoose from 'mongoose';
import {
  Order,
  IOrder,
  OrderStatus,
  OrderStatusHistory,
  ApplicationSettings,
  Payment,
  User,
  IShippingAddress,
} from '../models';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { inventoryService } from './inventoryService';
import { cartService } from './cartService';
import { notificationService } from './notificationService';
import { emitToOrder, emitToAdmin, emitStockUpdate } from '../sockets/socketHandler';

class OrderService {
  public async createOrder({
    userId,
    shippingAddress,
    paymentMethod = 'COD',
    notes,
  }: {
    userId: string | mongoose.Types.ObjectId;
    shippingAddress: IShippingAddress;
    paymentMethod?: 'COD' | 'ONLINE';
    notes?: string;
  }): Promise<IOrder> {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const cart = await cartService.getCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError('Your cart is empty. Add fresh Mangoes or Papayas to place an order.');
    }

    const settings = await ApplicationSettings.findOne();
    const minOrder = settings?.minOrderAmount || 100;
    if (cart.subtotal < minOrder) {
      throw new BadRequestError(`Minimum order amount is ₹${minOrder}. Current subtotal is ₹${cart.subtotal}`);
    }

    // Prepare reservation list
    const reservationItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    // Reserve stock (will throw if insufficient or unavailable)
    await inventoryService.reserveStock(reservationItems);

    const order = new Order({
      customer: userId,
      items: cart.items,
      subtotal: cart.subtotal,
      discount: cart.discount,
      deliveryFee: cart.deliveryFee,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'PLACED',
      statusHistory: [
        {
          status: 'PLACED',
          message: 'Order placed successfully. Awaiting store confirmation.',
          timestamp: new Date(),
        },
      ],
      notes,
    });

    await order.save();

    // Create standalone audit history
    await OrderStatusHistory.create({
      order: order._id,
      orderId: order.orderId,
      newStatus: 'PLACED',
      message: 'Order created by customer',
      updatedByUser: userId,
      source: 'CUSTOMER',
    });

    // Create payment tracking record
    await Payment.create({
      order: order._id,
      customer: userId,
      amount: order.totalAmount,
      method: paymentMethod,
      status: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
    });

    // Clear customer's cart
    await cartService.clearCart(userId);

    // Emit live events
    emitToAdmin('new_order', {
      orderId: order.orderId,
      customerName: user.name,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    });

    // Emit live stock update to all clients
    for (const item of cart.items) {
      emitStockUpdate(item.product.toString());
    }

    // Trigger customer notification
    await notificationService.notifyOrderStatusChange(
      order,
      user,
      'Your order has been received and placed successfully!'
    );

    return order;
  }

  public async updateOrderStatus({
    orderId,
    status,
    message,
    adminId,
  }: {
    orderId: string;
    status: OrderStatus;
    message?: string;
    adminId?: mongoose.Types.ObjectId;
  }): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');

    const previousStatus = order.orderStatus;
    if (previousStatus === 'CANCELLED') {
      throw new BadRequestError('Cannot update status of an already cancelled order.');
    }
    if (previousStatus === 'DELIVERED' && status !== 'CANCELLED') {
      throw new BadRequestError('Delivered orders cannot transition to an earlier status.');
    }

    const defaultMessages: Record<OrderStatus, string> = {
      PLACED: 'Your order has been placed.',
      CONFIRMED: 'Your order has been confirmed by the orchard manager.',
      PROCESSING: 'Your fresh fruits are currently being handpicked and prepared.',
      PACKED: 'Your fruits have been safely packed in eco-friendly protective crates.',
      OUT_FOR_DELIVERY: 'Your order is out for delivery! Our courier is on the way.',
      DELIVERED: 'Your order has been delivered. Enjoy your fresh fruits!',
      CANCELLED: 'Your order has been cancelled.',
    };

    const statusMessage = message || defaultMessages[status] || `Status updated to ${status}`;

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      message: statusMessage,
      timestamp: new Date(),
      updatedBy: adminId,
    });

    if (status === 'DELIVERED') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'PAID';
    }

    // If cancelling, restore the inventory stock automatically
    if (status === 'CANCELLED') {
      await inventoryService.restoreStock(
        order.items.map((i) => ({ product: i.product, quantity: i.quantity })),
        order._id,
        'Order status set to CANCELLED by Admin'
      );
      for (const item of order.items) {
        emitStockUpdate(item.product.toString());
      }
    }

    await order.save();

    // Create standalone audit history
    await OrderStatusHistory.create({
      order: order._id,
      orderId: order.orderId,
      previousStatus,
      newStatus: status,
      message: statusMessage,
      updatedByAdmin: adminId,
      source: 'ADMIN',
    });

    // Notify customer in real-time via Socket.IO
    emitToOrder(order._id.toString(), 'order_status_updated', {
      orderId: order.orderId,
      status: order.orderStatus,
      message: statusMessage,
      updatedAt: new Date(),
    });

    // Notify customer via Email/WhatsApp/SMS
    const customer = await User.findById(order.customer);
    if (customer) {
      await notificationService.notifyOrderStatusChange(order, customer, statusMessage);
    }

    return order;
  }

  public async cancelOrderByCustomer(orderId: string, userId: string, reason?: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, customer: userId });
    if (!order) throw new NotFoundError('Order not found');

    if (['PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus)) {
      throw new BadRequestError(`Cannot cancel order once it is ${order.orderStatus.toLowerCase().replace(/_/g, ' ')}`);
    }

    if (order.orderStatus === 'CANCELLED') {
      throw new BadRequestError('Order is already cancelled');
    }

    const previousStatus = order.orderStatus;
    const cancelMsg = reason ? `Cancelled by customer: ${reason}` : 'Cancelled by customer';

    order.orderStatus = 'CANCELLED';
    order.cancelReason = reason || 'Customer requested cancellation';
    order.statusHistory.push({
      status: 'CANCELLED',
      message: cancelMsg,
      timestamp: new Date(),
    });

    // Restore stock
    await inventoryService.restoreStock(
      order.items.map((i) => ({ product: i.product, quantity: i.quantity })),
      order._id,
      'Order cancelled by customer'
    );

    await order.save();

    // Standalone audit log
    await OrderStatusHistory.create({
      order: order._id,
      orderId: order.orderId,
      previousStatus,
      newStatus: 'CANCELLED',
      message: cancelMsg,
      updatedByUser: new mongoose.Types.ObjectId(userId),
      source: 'CUSTOMER',
    });

    // Emit live events
    emitToOrder(order._id.toString(), 'order_status_updated', {
      orderId: order.orderId,
      status: 'CANCELLED',
      message: cancelMsg,
      updatedAt: new Date(),
    });

    emitToAdmin('order_cancelled', {
      orderId: order.orderId,
      reason: cancelMsg,
    });

    for (const item of order.items) {
      emitStockUpdate(item.product.toString());
    }

    return order;
  }
}

export const orderService = new OrderService();
