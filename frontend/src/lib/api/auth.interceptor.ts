import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { tokenStorage } from '../storage/token.storage';
import { env } from '../config/env';
import { ENDPOINTS } from './endpoints';
import axios from 'axios';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

export const setupAuthInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const tokens = tokenStorage.getTokens();
      if (tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const tokens = tokenStorage.getTokens();
        if (!tokens?.refreshToken) {
          processQueue(new Error('No refresh token'), null);
          isRefreshing = false;
          tokenStorage.clearTokens();
          if (typeof window !== 'undefined') window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          // Direct axios call to avoid interceptor loop
          const response = await axios.post(`${env.NEXT_PUBLIC_API_URL}${ENDPOINTS.AUTH.REFRESH}`, {
            refreshToken: tokens.refreshToken,
          });

          const newTokens = response.data.data; // Assuming ApiResponse<AuthTokens>
          tokenStorage.setTokens(newTokens);
          
          processQueue(null, newTokens.accessToken);
          isRefreshing = false;
          
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          tokenStorage.clearTokens();
          if (typeof window !== 'undefined') window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
