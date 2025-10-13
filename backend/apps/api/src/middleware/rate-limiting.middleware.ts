import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheProvider } from '../providers';

@Injectable()
export class RateLimitingMiddleware implements NestMiddleware {
  private readonly maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100');
  private readonly windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '900000'); // 15 minutes

  constructor(private readonly cacheProvider: CacheProvider) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const clientId = this.getClientId(req);
    const key = `rate_limit:${clientId}`;
    
    const current = this.cacheProvider.get<number>(key) || 0;
    
    if (current >= this.maxRequests) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Increment counter
    this.cacheProvider.set(key, current + 1, this.windowMs);

    // Add rate limit headers
    res.header('X-RateLimit-Limit', this.maxRequests.toString());
    res.header('X-RateLimit-Remaining', Math.max(0, this.maxRequests - current - 1).toString());
    res.header('X-RateLimit-Reset', new Date(Date.now() + this.windowMs).toISOString());

    next();
  }

  private getClientId(req: Request): string {
    // Use IP address as client identifier
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
}
