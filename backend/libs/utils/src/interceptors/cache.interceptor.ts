import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
} from '../decorators/cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);
  private readonly cache = new Map<string, { data: any; expiry: number }>();

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cacheKey = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    const cacheTTL = this.reflector.get<number>(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );

    if (!cacheKey || !cacheTTL) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const fullCacheKey = `${cacheKey}:${JSON.stringify(request.query)}:${JSON.stringify(request.params)}`;

    // Check if data exists in cache and is not expired
    const cached = this.cache.get(fullCacheKey);
    if (cached && cached.expiry > Date.now()) {
      this.logger.log(`Cache hit for key: ${fullCacheKey}`);
      return of(cached.data);
    }

    this.logger.log(`Cache miss for key: ${fullCacheKey}`);

    return next.handle().pipe(
      tap(data => {
        // Store in cache
        this.cache.set(fullCacheKey, {
          data,
          expiry: Date.now() + cacheTTL * 1000,
        });

        // Clean up expired entries
        this.cleanupExpiredEntries();
      }),
    );
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expiry <= now) {
        this.cache.delete(key);
      }
    }
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}
