import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, ShieldCheck, AlertCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';
import { OrderTimeline } from '../components/OrderTimeline';
import { getSocket } from '../services/socket';

export const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [liveMessage, setLiveMessage] = useState<string>('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await api.get(`/orders/${orderId}`);
        const orderData: Order = res.data?.data;
        setOrder(orderData);

        // Join real-time socket room for this order
        const socket = getSocket();
        socket.emit('join_order_room', orderData._id);

        // Listen for live status change event
        socket.on('order_status_updated', (data: any) => {
          if (data.orderId === orderData.orderId) {
            setOrder((prev) =>
              prev
                ? {
                    ...prev,
                    orderStatus: data.status,
                    statusHistory: [
                      ...prev.statusHistory,
                      {
                        status: data.status,
                        message: data.message,
                        timestamp: data.updatedAt,
                      },
                    ],
                  }
                : null
            );
            setLiveMessage(`🚨 Status Update: ${data.message}`);
            setTimeout(() => setLiveMessage(''), 5000);
          }
        });
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    return () => {
      if (order?._id) {
        const socket = getSocket();
        socket.emit('leave_order_room', order._id);
        socket.off('order_status_updated');
      }
    };
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      setCancelling(true);
      const res = await api.post(`/orders/${order._id}/cancel`, {
        reason: cancelReason || 'Customer cancellation request',
      });
      if (res.data?.data) {
        setOrder(res.data.data);
        setShowCancelModal(false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-6 bg-amber-100 rounded w-1/4" />
        <div className="h-32 bg-amber-100 rounded-3xl" />
        <div className="h-48 bg-amber-50 rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <span className="text-6xl">📦</span>
        <h2 className="text-2xl font-bold text-stone-900">Order not found</h2>
        <Link
          to="/orders"
          className="inline-block px-6 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-full"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const canCancel = ['PLACED', 'CONFIRMED', 'PROCESSING'].includes(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/orders"
        className="inline-flex items-center space-x-2 text-xs font-bold text-stone-600 hover:text-amber-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Orders</span>
      </Link>

      {/* Real-time Socket Toast Notification */}
      {liveMessage && (
        <div className="p-4 bg-amber-500 text-white font-bold text-xs rounded-2xl shadow-lg animate-bounce flex items-center space-x-2">
          <Truck className="w-5 h-5 shrink-0" />
          <span>{liveMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-50">
          <div>
            <span className="text-xs font-bold text-stone-400 uppercase">Order Reference</span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">#{order.orderId}</h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-stone-400 uppercase">Status</span>
            <p className="text-lg font-black text-amber-600">
              {order.orderStatus.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        {/* Real-time Visual Timeline */}
        <OrderTimeline currentStatus={order.orderStatus} history={order.statusHistory} />

        {/* Cancellation Button if eligible */}
        {canCancel && (
          <div className="pt-4 border-t border-amber-50 flex justify-end">
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
            >
              Cancel This Order
            </button>
          </div>
        )}
      </div>

      {/* Items Breakdown and Delivery Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items List */}
        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
          <h3 className="text-base font-black text-stone-900">Harvest Items</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-stone-50">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=100&q=80'}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-100 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-stone-900">{item.name}</p>
                    <p className="text-stone-500">
                      ₹{item.discountPrice || item.price} × {item.quantity} {item.unit}
                    </p>
                  </div>
                </div>
                <span className="font-black text-stone-900">₹{item.subtotal.toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 space-y-1.5 text-xs text-stone-600 border-t border-amber-50">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span className="font-bold">-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold">
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-amber-100">
              <span>Total Amount</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address & Payment info */}
        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-black text-stone-900 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Shipping Address</span>
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-stone-700 leading-relaxed">
              <p className="font-bold text-stone-900">{order.shippingAddress.fullName}</p>
              <p className="text-stone-500">📱 {order.shippingAddress.phone}</p>
              <p className="mt-1">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-black text-stone-900">Payment Summary</h3>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-stone-700 space-y-1">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-bold text-stone-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-bold text-stone-900">{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-amber-100 shadow-2xl">
            <h3 className="text-lg font-black text-stone-900">Cancel Order #{order.orderId}?</h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to cancel? Reserved inventory stock will be restored to the orchard stock immediately.
            </p>
            <textarea
              placeholder="Reason for cancellation (optional)..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
