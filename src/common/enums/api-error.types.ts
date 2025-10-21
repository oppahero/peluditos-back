export enum ApiErrorType {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  INSUFFICIENT_PRIVILEGES = 'INSUFFICIENT_PRIVILEGES',
  NOT_ALLOWED = 'NOT_ALLOWED',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  CONFLICT = 'CONFLICT',
  DATABASE_ERROR = 'DatabaseError',
}

export interface ApiErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  error: string | QueryFailedErrorResponse | ExceptionResponse;
}

export interface ExceptionResponse {
  type: ApiErrorType;
  detail?: string;
  errors?: string[];
  constraint?: string;
}

export interface QueryFailedErrorResponse {
  type: ApiErrorType;
  detail?: string;
  errors?: string[];
  constraint?: string;
}

export function buildApiErrorResponse(
  statusCode: number,
  pathSegment: string,
  type: ApiErrorType,
  detail?: string,
): ApiErrorResponse {
  return {
    statusCode,
    timestamp: new Date().toISOString(),
    path: `/api/${pathSegment}`,
    error: {
      type,
      detail,
    },
  };
}
