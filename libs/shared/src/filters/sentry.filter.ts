// libs/shared/src/filters/sentry-exception.filter.ts
import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  constructor(private readonly serviceName: string) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determinar status code (500 si no es HttpException)
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extraer mensaje de error
    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';

    // Tags dinámicos basados en el servicio y endpoint
    Sentry.setTag('microservice', this.serviceName);
    Sentry.setTag('endpoint', request.url);
    Sentry.setTag('method', request.method);
    Sentry.setTag('status_code', status.toString());

    // Agregar contexto adicional para debugging
    Sentry.setContext('request', {
      url: request.url,
      method: request.method,
      headers: this.sanitizeHeaders(request.headers),
      query: request.query,
      body: this.sanitizeBody(request.body),
    });

    // Capturar excepción en Sentry
    Sentry.captureException(exception);

    // Retornar respuesta JSON estructurada al cliente
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      service: this.serviceName,
      ...(process.env['NODE_ENV'] !== 'production' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    });
  }

  // Sanitizar body para eliminar datos sensibles
  private sanitizeBody(body: any): any {
    if (!body) return undefined;

    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'token',
      'apiKey',
    ];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }

  // Sanitizar headers para no enviar tokens completos
  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };

    if (sanitized.authorization) {
      sanitized.authorization = '***REDACTED***';
    }

    if (sanitized.cookie) {
      sanitized.cookie = '***REDACTED***';
    }

    return sanitized;
  }
}
