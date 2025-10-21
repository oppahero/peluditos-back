import { Response, Request } from 'express';
import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { ApiErrorType } from 'src/common/enums/api-error.types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    // Si es una excepción HTTP
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      console.log(res);

      const rawMessage =
        typeof res === 'object' && res !== null ? (res as any).message : res;

      if (
        exception instanceof BadRequestException &&
        Array.isArray(rawMessage)
      ) {
        message = {
          type: ApiErrorType.BAD_REQUEST,
          errors: rawMessage,
        };
      } else {
        switch (status) {
          case HttpStatus.UNAUTHORIZED:
            message = {
              type: ApiErrorType.UNAUTHENTICATED,
              detail: rawMessage || 'Authentication required or failed',
            };
            break;
          case HttpStatus.FORBIDDEN:
            message = {
              type: ApiErrorType.INSUFFICIENT_PRIVILEGES,
              detail:
                rawMessage || 'Access denied due to insufficient permissions',
            };
            break;
          case HttpStatus.METHOD_NOT_ALLOWED:
            message = {
              type: ApiErrorType.NOT_ALLOWED,
              detail: rawMessage || 'HTTP method not allowed on this endpoint',
            };
            break;
          case HttpStatus.NOT_IMPLEMENTED:
            message = {
              type: ApiErrorType.NOT_IMPLEMENTED,
              detail: rawMessage || 'This functionality is not implemented',
            };
            break;
          case HttpStatus.NOT_FOUND:
            message = {
              type: ApiErrorType.RESOURCE_NOT_FOUND,
              detail: rawMessage || 'The requested resource was not found',
            };
            break;
          case HttpStatus.INTERNAL_SERVER_ERROR:
            message = {
              type: ApiErrorType.SERVER_ERROR,
              detail: rawMessage || 'Unexpected server error',
            };
            break;
          case HttpStatus.CONFLICT:
            message = {
              type: ApiErrorType.CONFLICT,
              detail: rawMessage || 'Resource conflict',
            };
            break;
          default:
            message = rawMessage;
        }
      }
    }

    // Lanzado por el motor de base de datos QueryFailedError
    else if (typeof exception === 'object' && exception !== null) {
      const error = exception as any;
      if (error.code === '23505') {
        message = {
          type: ApiErrorType.CONFLICT,
          detail: message || 'Duplicate entry',
          constraint: error.constraint,
        };
      } else if (error.code === '23503') {
        message = {
          type: ApiErrorType.DATABASE_ERROR,
          detail:
            'El registro es referenciado por otros registros en la base de datos. Resuelva las dependencias antes de intentar eliminar este registro.',
          constraint: error.constraint,
        };
      }
      // Otros errores de base de datos
      else if (error.name === 'QueryFailedError') {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = {
          type: 'DatabaseError',
          detail: error.message,
        };
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
