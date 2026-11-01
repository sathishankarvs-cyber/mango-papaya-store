import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, MapPin } from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderId) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/orders/${orderId}`);
          setOrder(res.data?.data || null);
        } catch (err) {
          console.error('Failed to load order confirmation:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Thank you for choosing PSN Farm. Your fresh tree-ripened fruits are being queued for harvest packing.
        </p>
      </div>

      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm text-left space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-amber-50">
            <div>
              <p className="text-xs text-stone-500 font-bold uppercase">Order Reference</p>
              <p className="text-xl font-black text-amber-600">#{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-500 font-bold uppercase">Total Amount</p>
              <p className="text-xl font-black text-stone-900">₹{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Delivery Address Snapshot */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Delivering To</span>
            </h4>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-stone-700">
              <p className="font-bold text-stone-900">{order.shippingAddress.fullName} (📱 {order.shippingAddress.phone})</p>
              <p className="mt-1">{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Harvest Items</h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-50">
                  <span className="font-semibold text-stone-800">
                    {item.name} ({item.quantity} {item.unit})
                  </span>
                  <span className="font-bold text-stone-900">₹{item.subtotal.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-amber-50">
            <Link
              to={`/orders/${order._id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center space-x-2 shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Status</span>
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center space-x-1"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
