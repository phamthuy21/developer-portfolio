export enum Role {
  ADMIN = 'Admin',
  USER = 'User',
}

/** Shape of the JWT payload signed by the backend (sub, email, role). */
export interface User {
  sub: string;
  email: string;
  name?: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

