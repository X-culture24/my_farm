export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  farmId?: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'worker';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  farmId?: string;
}

// Role-based permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'farms', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'livestock', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'sales', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'settings', actions: ['read', 'update'] },
  ],
  manager: [
    { resource: 'farms', actions: ['read', 'update'] },
    { resource: 'livestock', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'sales', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'workers', actions: ['read', 'update'] },
  ],
  worker: [
    { resource: 'livestock', actions: ['read', 'update'] },
    { resource: 'products', actions: ['read', 'update'] },
    { resource: 'sales', actions: ['create', 'read'] },
    { resource: 'tasks', actions: ['read', 'update'] },
  ],
};

export const hasPermission = (user: User | null, resource: string, action: string): boolean => {
  if (!user) return false;
  
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  const resourcePermission = permissions.find(p => p.resource === resource);
  
  return resourcePermission?.actions.includes(action) || false;
};

export const canAccessRoute = (user: User | null, route: string): boolean => {
  if (!user) return false;

  const routePermissions: Record<string, { resource: string; action: string }> = {
    '/app/dashboard': { resource: 'analytics', action: 'read' },
    '/app/farms': { resource: 'farms', action: 'read' },
    '/app/livestock': { resource: 'livestock', action: 'read' },
    '/app/animal-products': { resource: 'products', action: 'read' },
    '/app/farm-products': { resource: 'products', action: 'read' },
    '/app/sales': { resource: 'sales', action: 'read' },
    '/app/analytics': { resource: 'analytics', action: 'read' },
    '/app/profile': { resource: 'users', action: 'read' },
  };

  const permission = routePermissions[route];
  if (!permission) return true; // Allow access to routes not defined

  return hasPermission(user, permission.resource, permission.action);
};
