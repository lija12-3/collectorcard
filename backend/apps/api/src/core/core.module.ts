import { Module, Global } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from '../filters/global-exception.filter';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { CacheInterceptor } from '../interceptors/cache.interceptor';
import { RolesGuard } from '../guards/roles.guard';
import { PublicGuard } from '../guards/public.guard';
import { EncryptionProvider, LoggingProvider, CacheProvider } from '../providers';

@Global()
@Module({
  providers: [
    // Providers
    EncryptionProvider,
    LoggingProvider,
    CacheProvider,
    
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    
    // Global Guards
    {
      provide: APP_GUARD,
      useClass: PublicGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [
    EncryptionProvider,
    LoggingProvider,
    CacheProvider,
  ],
})
export class CoreModule {}
