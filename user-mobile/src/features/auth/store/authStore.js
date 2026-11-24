
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

import authService from '../services/authService';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Login
  login: async (email, password) => {
    const response = await authService.loginUser(email, password);

    const { token, user } = response;

    await SecureStore.setItemAsync('userToken', token);

    set({
      user,
      isAuthenticated: true,
    });

    return response;
  },

  // Register
  register: async (userData) => {
    return await authService.registerUser(userData);
  },

  // Get Profile
  getProfile: async () => {
    const user = await authService.getUserProfile();

    set({
      user,
      isAuthenticated: true,
    });

    return user;
  },

  // Restore Login Session
  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');

      if (!token) {
        set({
          isAuthenticated: false,
          user: null,
        });
        return;
      }

      const user = await authService.getUserProfile();

      set({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      await SecureStore.deleteItemAsync('userToken');

      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Logout
  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
