import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types';
import { api } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'parent' | 'child', inviteCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const response = await api.post<{ user: User; token: string }>('/auth/login', {
        email,
        password,
      });

      await SecureStore.setItemAsync('authToken', response.token);
      await SecureStore.setItemAsync('user', JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (
    email: string,
    password: string,
    name: string,
    role: 'parent' | 'child',
    inviteCode?: string
  ) => {
    try {
      const response = await api.post<{ user: User; token: string }>('/auth/register', {
        email,
        password,
        name,
        role,
        inviteCode,
      });

      await SecureStore.setItemAsync('authToken', response.token);
      await SecureStore.setItemAsync('user', JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const userString = await SecureStore.getItemAsync('user');

      if (token && userString) {
        const user = JSON.parse(userString);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));

