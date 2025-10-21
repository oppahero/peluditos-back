import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

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

      // Si es BadRequest con errores de validación
      if (
        exception instanceof BadRequestException &&
        typeof res === 'object' &&
        (res as any).message &&
        Array.isArray((res as any).message)
      ) {
        message = {
          type: 'ValidationError',
          errors: (res as any).message,
        };
      } else {
        message = res;
      }
    }

    // Si es un error de base de datos (TypeORM o Prisma)
    else if (typeof exception === 'object' && exception !== null) {
      const error = exception as any;

      // TypeORM: violación de clave única
      if (error.code === '23505') {
        status = HttpStatus.BAD_REQUEST;
        message = {
          type: 'DatabaseError',
          detail: 'Duplicate entry',
          constraint: error.constraint,
        };
      }
      if (error.code === '23503') {
        status = HttpStatus.BAD_REQUEST;
        message = {
          type: 'DatabaseError',
          detail: 'FK violation',
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
