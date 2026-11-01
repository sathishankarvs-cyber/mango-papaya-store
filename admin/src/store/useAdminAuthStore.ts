import { create } from 'zustand';
import { AdminUser } from '../types';

interface AdminAuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => {
  const token = localStorage.getItem('admin_token');
  const storedUser = localStorage.getItem('admin_user');
  const admin = storedUser ? JSON.parse(storedUser) : null;

  return {
    admin,
    token,
    isAuthenticated: !!token && !!admin,

    login: (token: string, admin: AdminUser) => {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(admin));
      set({ token, admin, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      set({ token: null, admin: null, isAuthenticated: false });
    },
  };
});
