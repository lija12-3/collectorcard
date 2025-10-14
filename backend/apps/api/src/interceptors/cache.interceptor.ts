import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CacheProvider } from '../providers';
import { CACHE_KEY, CACHE_TTL_KEY } from '../decorators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheProvider: CacheProvider,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = this.reflector.getAllAndOverride<boolean>(CACHE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isCached) {
      return next.handle();
    }

    const ttl =
      this.reflector.getAllAndOverride<number>(CACHE_TTL_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || 300000; // 5 minutes default

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(request);

    // Try to get from cache
    const cachedResponse = this.cacheProvider.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // If not in cache, execute and cache the result
    return next.handle().pipe(
      tap(response => {
        this.cacheProvider.set(cacheKey, response, ttl);
      }),
    );
  }

  private generateCacheKey(request: any): string {
    const { method, url, query, body } = request;
    const keyData = {
      method,
      url,
      query: JSON.stringify(query),
      body: JSON.stringify(body),
    };
    return `cache:${Buffer.from(JSON.stringify(keyData)).toString('base64')}`;
  }
}
