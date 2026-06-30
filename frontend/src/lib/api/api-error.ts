import { ProblemDetails } from '@/types/api';

export class ApiError extends Error {
  public status: number;
  public problem?: ProblemDetails;
  public validationErrors?: Record<string, string[]>;

  constructor(status: number, message: string, problem?: ProblemDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.problem = problem;

    if (problem?.errors) {
      this.validationErrors = problem.errors;
    }
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', problem?: ProblemDetails) {
    super(401, message, problem);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', problem?: ProblemDetails) {
    super(403, message, problem);
    this.name = 'ForbiddenError';
  }
}
