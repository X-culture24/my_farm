import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'farmer' | 'worker' | 'viewer';
  farms: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: (token: string) => {
        try {
          const decoded = jwtDecode(token) as any;
          const user: User = {
            _id: decoded.userId,
            firstName: decoded.firstName || 'User',
            lastName: decoded.lastName || '',
            email: decoded.email || '',
            role: decoded.role || 'farmer',
            farms: decoded.farms || [],
            isActive: decoded.isActive !== false,
            createdAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : new Date().toISOString(),
            updatedAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : new Date().toISOString(),
          };

          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          set({
            error: 'Invalid token format',
            isAuthenticated: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
