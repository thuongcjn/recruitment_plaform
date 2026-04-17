import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logoutUser } from '@/api/authApi';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user) => set({ 
        user, 
        isAuthenticated: true 
      }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),

      handleLogout: async () => {
        try {
          await logoutUser();
        } catch (err) {
          console.error('Logout API error', err);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
