import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { LoginFormData } from '../schemas/login.schema';
import { AuthSession, AuthTokens, User, Role } from '@/types/auth';
import { ApiResponse } from '@/types/api';

/** Decode JWT claims without signature verification (trusted from our own backend). */
function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = token.split('.')[1];
  if (!base64) throw new Error('Invalid access token received');
  const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(json) as Record<string, unknown>;
}

export const loginApi = async (data: LoginFormData): Promise<AuthSession> => {
  // Backend returns: { data: { accessToken, refreshToken } }
  const response = await apiClient.post<ApiResponse<AuthTokens>>(
    ENDPOINTS.AUTH.LOGIN,
    data,
  );

  const tokens: AuthTokens = response.data.data;

  // Extract user identity from the JWT payload — no extra /me call needed.
  const payload = decodeJwtPayload(tokens.accessToken);

  const user: User = {
    sub: payload.sub as string,
    email: payload.email as string,
    role: (payload.role as Role) ?? Role.ADMIN,
  };

  return { user, tokens };
};

