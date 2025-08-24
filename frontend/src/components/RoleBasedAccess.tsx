import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'manager' | 'worker')[];
  requiredPermission?: {
    resource: string;
    action: string;
  };
  fallback?: React.ReactNode;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
}) => {
  const { user, checkPermission } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  // Check permission-based access
  if (requiredPermission && !checkPermission(requiredPermission.resource, requiredPermission.action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleBasedAccess;
