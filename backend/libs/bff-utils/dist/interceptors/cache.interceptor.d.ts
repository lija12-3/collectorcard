import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
export declare class CacheInterceptor implements NestInterceptor {
    private reflector;
    private readonly logger;
    private cache;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private cleanupExpiredEntries;
    clearCache(pattern?: string): void;
}
