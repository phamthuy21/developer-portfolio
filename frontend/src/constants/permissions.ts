import { Role } from '@/types/auth';

export const PERMISSIONS = {
  ADMIN_ACCESS: [Role.ADMIN],
  USER_ACCESS: [Role.ADMIN, Role.USER],
} as const;
