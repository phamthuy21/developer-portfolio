import * as jwt from 'jsonwebtoken';

export const generateAdminToken = (userId: string = 'admin-user-id') => {
  return jwt.sign(
    { sub: userId, role: 'Admin' },
    process.env.JWT_SECRET || 'test-jwt-secret-key',
    { expiresIn: '1h' },
  );
};

export const getAuthHeaders = (token?: string) => {
  return { Authorization: `Bearer ${token || generateAdminToken()}` };
};
