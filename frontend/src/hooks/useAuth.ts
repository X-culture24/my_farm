import { useAuthStore } from '../store/authStore';
import { User, hasPermission, canAccessRoute } from '../types/auth';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, register } = useAuthStore();

  const checkPermission = (resource: string, action: string): boolean => {
    return hasPermission(user, resource, action);
  };

  const checkRouteAccess = (route: string): boolean => {
    return canAccessRoute(user, route);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isManager = (): boolean => {
    return user?.role === 'manager';
  };

  const isWorker = (): boolean => {
    return user?.role === 'worker';
  };

  const canManage = (): boolean => {
    return user?.role === 'admin' || user?.role === 'manager';
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    register,
    checkPermission,
    checkRouteAccess,
    isAdmin,
    isManager,
    isWorker,
    canManage,
  };
};
