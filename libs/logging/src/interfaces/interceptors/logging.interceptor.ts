import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../../application/services/logger.service';

interface SanitizedData {
  [key: string]: unknown;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly serviceName: string;
  constructor(
    private readonly loggingService: LoggingService,
    @Inject('SERVICE_NAME') serviceName: string
  ) {
    this.serviceName = serviceName;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const { method, url, headers, body, query, ip } = request;
    const userAgent = headers['user-agent'] || '';

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const responseTime = Date.now() - startTime;

          this.loggingService.createLog({
            method,
            url,
            statusCode: response.statusCode,
            headers: this.sanitizeHeaders(headers),
            body: this.sanitizeBody(body),
            query,
            response: this.sanitizeBody(responseBody),
            timestamp: new Date(),
            responseTime,
            ip,
            userAgent,
            service: this.serviceName,
            level: 'info',
          }).catch(err => console.error('Failed to log request:', err));
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;

          this.loggingService.createLog({
            method,
            url,
            statusCode: error.status || 500,
            headers: this.sanitizeHeaders(headers),
            body: this.sanitizeBody(body),
            query,
            response: { message: error.message, stack: error.stack },
            timestamp: new Date(),
            responseTime,
            ip,
            userAgent,
            service: this.serviceName,
            error: error.message,
            level: 'error',
          }).catch(err => console.error('Failed to log error:', err));
        },
      })
    );
  }

  private sanitizeHeaders(headers: Record<string, string | string[] | undefined>
  ): Record<string, string | string[]> {
    const sanitized = { ...headers };
    // Eliminar información sensible
    delete sanitized.authorization;
    delete sanitized.cookie;
    return sanitized;
  }

  private sanitizeBody(body: unknown): Record<string, unknown> {
    if (!body || typeof body !== 'object') {
      return {};
    }

    const sanitized: SanitizedData = { ...body as Record<string, unknown> };

    // Eliminar campos sensibles
    if ('password' in sanitized) {
      sanitized.password = '***REDACTED***';
    }
    if ('token' in sanitized) {
      sanitized.token = '***REDACTED***';
    }

    return sanitized;
  }
}
