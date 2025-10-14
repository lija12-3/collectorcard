import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const now = Date.now();

    this.logger.log(`Incoming request: ${method} ${url} from ${ip}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const duration = Date.now() - now;

        this.logger.log(
          `Outgoing response: ${method} ${url} ${statusCode} - ${duration}ms`,
        );
      }),
      catchError(error => {
        const duration = Date.now() - now;
        this.logger.error(
          `Request failed: ${method} ${url} - ${duration}ms - ${error.message}`,
          error.stack,
        );
        return throwError(() => error);
      }),
    );
  }
}
