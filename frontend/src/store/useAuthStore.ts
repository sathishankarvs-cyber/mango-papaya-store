import { create } from 'zustand';
import api from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading: false,

    login: (token: string, user: User) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null, isAuthenticated: false });
    },

    fetchProfile: async () => {
      try {
        set({ isLoading: true });
        const res = await api.get('/auth/me');
        if (res.data?.data) {
          const user = res.data.data;
          localStorage.setItem('user', JSON.stringify(user));
          set({ user, isAuthenticated: true, isLoading: false });
        }
      } catch {
        set({ isLoading: false });
      }
    },

    updateUser: (updatedFields: Partial<User>) => {
      set((state) => {
        if (!state.user) return state;
        const newUser = { ...state.user, ...updatedFields };
        localStorage.setItem('user', JSON.stringify(newUser));
        return { user: newUser };
      });
    },
  };
});
