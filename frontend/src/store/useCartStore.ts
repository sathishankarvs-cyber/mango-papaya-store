import { create } from 'zustand';
import api from '../services/api';
import { Cart } from '../types';

interface CartState {
  cart: Cart;
  isLoading: boolean;
  itemCount: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  deliveryFee: 0,
  totalAmount: 0,
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: initialCart,
  isLoading: false,
  itemCount: 0,

  fetchCart: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ cart: initialCart, itemCount: 0 });
      return;
    }

    try {
      set({ isLoading: true });
      const res = await api.get('/cart');
      if (res.data?.data) {
        const cart: Cart = res.data.data;
        const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        set({ cart, itemCount: Math.round(count * 10) / 10, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId: string, quantity = 1) => {
    try {
      set({ isLoading: true });
      const res = await api.post('/cart/add', { productId, quantity });
      if (res.data?.data) {
        const cart: Cart = res.data.data;
        const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        set({ cart, itemCount: Math.round(count * 10) / 10, isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    try {
      set({ isLoading: true });
      const res = await api.put('/cart/update', { productId, quantity });
      if (res.data?.data) {
        const cart: Cart = res.data.data;
        const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        set({ cart, itemCount: Math.round(count * 10) / 10, isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  removeItem: async (productId: string) => {
    try {
      set({ isLoading: true });
      const res = await api.delete(`/cart/remove/${productId}`);
      if (res.data?.data) {
        const cart: Cart = res.data.data;
        const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        set({ cart, itemCount: Math.round(count * 10) / 10, isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
      set({ cart: initialCart, itemCount: 0 });
    } catch (err) {
      throw err;
    }
  },
}));
