'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './auth.provider';
import { Role } from '@/types/auth';

interface PermissionContextType {
  hasRole: (roles: Role[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <PermissionContext.Provider value={{ hasRole }}>
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
};
