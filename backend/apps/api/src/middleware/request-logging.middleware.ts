import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const startTime = Date.now();

    // Log request
    this.logger.log(`${method} ${originalUrl} - ${ip} - ${userAgent}`);

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any, cb?: any) {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      // Log response
      const logLevel = statusCode >= 400 ? 'error' : 'log';
      const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip}`;

      if (logLevel === 'error') {
        Logger.prototype.error.call(this, message);
      } else {
        Logger.prototype.log.call(this, message);
      }

      return originalEnd.call(this, chunk, encoding, cb);
    };

    next();
  }
}
