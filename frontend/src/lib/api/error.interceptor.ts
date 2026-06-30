import { AxiosInstance, AxiosError } from 'axios';
import { ApiError, UnauthorizedError, ForbiddenError } from './api-error';
import { ProblemDetails } from '@/types/api';

export const setupErrorInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // If it's not an HTTP error (e.g. network error)
      if (!error.response) {
        return Promise.reject(new ApiError(0, error.message));
      }

      const status = error.response.status;
      const data = error.response.data as ProblemDetails | { message: string } | string;
      
      let problem: ProblemDetails | undefined = undefined;
      let message = error.message;

      // Detect RFC 7807 Problem Details
      if (typeof data === 'object' && data !== null && 'type' in data && 'title' in data) {
        problem = data as ProblemDetails;
        message = problem.title || problem.detail || message;
      } else if (typeof data === 'object' && data !== null && 'message' in data) {
        message = (data as { message: string }).message;
      } else if (typeof data === 'string') {
        message = data;
      }

      if (status === 401) {
        return Promise.reject(new UnauthorizedError(message, problem));
      }

      if (status === 403) {
        return Promise.reject(new ForbiddenError(message, problem));
      }

      return Promise.reject(new ApiError(status, message, problem));
    }
  );
};
