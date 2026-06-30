import { usePermissionContext } from '@/providers/permission.provider';
import { Role } from '@/types/auth';

export const usePermission = () => {
  const context = usePermissionContext();

  return {
    hasRole: (roles: Role[]) => context.hasRole(roles),
    isAdmin: context.hasRole([Role.ADMIN]),
    isUser: context.hasRole([Role.USER]),
  };
};
