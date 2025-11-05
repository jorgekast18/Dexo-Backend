import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../../application/services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const serviceName = request.headers['x-service-name'] || 'unknown-service';

    return next.handle().pipe(
      tap((response) => {
        this.logger.logRequest({
          serviceName,
          method: request.method,
          path: request.url,
          requestBody: request.body,
          responseBody: response,
          statusCode: ctx.getResponse().statusCode,
        });
      }),
    );
  }
}
