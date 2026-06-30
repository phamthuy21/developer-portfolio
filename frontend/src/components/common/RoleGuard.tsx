'use client';

import React, { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { Role } from '@/types/auth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { hasRole } = usePermission();

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
