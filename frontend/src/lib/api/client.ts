import axios from 'axios';
import { env } from '../config/env';
import { setupAuthInterceptor } from './auth.interceptor';
import { setupErrorInterceptor } from './error.interceptor';

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For potential future cookie usage, though we use localStorage mostly
});

setupAuthInterceptor(apiClient);
setupErrorInterceptor(apiClient);
