import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole, LoginCredentials, RegisterData } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true });

          // Mock login - replace with actual API call
          const mockUser: User = {
            _id: '1',
            email: credentials.email,
            name: 'John Doe',
            role: credentials.email.includes('admin') ? 'admin' :
                  credentials.email.includes('manager') ? 'manager' : 'worker',
            farmId: '1',
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const mockToken = 'mock-jwt-token';

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Login failed');
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true });

          // Mock registration - replace with actual API call
          const mockUser: User = {
            _id: '2',
            email: userData.email,
            name: userData.name,
            role: userData.role,
            farmId: userData.farmId,
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const mockToken = 'mock-jwt-token';

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Registration failed');
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
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
