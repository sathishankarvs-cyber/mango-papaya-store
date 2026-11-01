import React from 'react';
import { CheckCircle2, Clock, PackageCheck, Truck, Sparkles, XCircle, Box } from 'lucide-react';
import { OrderStatus, OrderStatusHistoryItem } from '../types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  history?: OrderStatusHistoryItem[];
}

const steps: Array<{ status: OrderStatus; label: string; icon: React.ReactNode }> = [
  { status: 'PLACED', label: 'Order Placed', icon: <Clock className="w-5 h-5" /> },
  { status: 'CONFIRMED', label: 'Confirmed', icon: <CheckCircle2 className="w-5 h-5" /> },
  { status: 'PROCESSING', label: 'Handpicking & Prep', icon: <Sparkles className="w-5 h-5" /> },
  { status: 'PACKED', label: 'Packed & Sealed', icon: <Box className="w-5 h-5" /> },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: <Truck className="w-5 h-5" /> },
  { status: 'DELIVERED', label: 'Delivered', icon: <PackageCheck className="w-5 h-5" /> },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, history = [] }) => {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-4 text-red-800">
        <XCircle className="w-8 h-8 text-red-500 shrink-0" />
        <div>
          <h4 className="font-bold text-base">This order has been cancelled</h4>
          <p className="text-xs text-red-600 mt-0.5">
            Any payments or reserved inventory items have been credited and restored.
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.status === currentStatus);

  return (
    <div className="w-full py-6">
      {/* Desktop Step Flow */}
      <div className="hidden sm:grid grid-cols-6 gap-2 relative">
        {/* Progress Bar background line */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-stone-200 -z-0" />
        <div
          className="absolute top-5 left-8 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 -z-0"
          style={{
            width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%`,
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isCurrent
                    ? 'bg-amber-500 text-white ring-4 ring-amber-200 scale-110 animate-pulse'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white border-2 border-stone-300 text-stone-400'
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`mt-3 text-xs font-bold ${
                  isCurrent
                    ? 'text-amber-700'
                    : isCompleted
                    ? 'text-emerald-800'
                    : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical View */}
      <div className="sm:hidden space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500 text-white ring-2 ring-amber-200'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`text-xs font-bold ${
                  isCurrent ? 'text-amber-700' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Audit History Log */}
      {history.length > 0 && (
        <div className="mt-8 pt-6 border-t border-amber-100">
          <h5 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
            Real-Time Tracking Events
          </h5>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-start justify-between text-xs py-1.5 border-b border-stone-50">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-semibold text-stone-800">{h.message}</span>
                </div>
                <span className="text-stone-400 text-[11px] shrink-0 ml-4">
                  {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
