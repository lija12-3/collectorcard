import { Module, DynamicModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from './services/jwt.service';
import { EncryptionService } from './services/encryption.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RolesGuard } from './guards/roles.guard';
import { IAuthConfig } from './types/auth.types';

export interface IAuthModuleOptions {
  config: IAuthConfig;
  enableGlobalGuards?: boolean;
  enableGlobalInterceptors?: boolean;
  enableMiddleware?: boolean;
}

@Module({})
export class AuthModule {
  static forRoot(options: IAuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        PassportModule,
        JwtModule.register({
          secret: options.config.jwtSecret,
          signOptions: {
            expiresIn: options.config.jwtExpiresIn as any,
          },
        }),
      ],
      providers: [
        {
          provide: 'IAuthConfig',
          useValue: options.config,
        },
        {
          provide: 'EncryptionKey',
          useValue: options.config.encryptionKey,
        },
        JwtService,
        {
          provide: EncryptionService,
          useFactory: (encryptionKey: string) =>
            new EncryptionService(encryptionKey),
          inject: ['EncryptionKey'],
        },
        AccessTokenGuard,
        RolesGuard,
      ],
      exports: [JwtService, EncryptionService, AccessTokenGuard, RolesGuard],
    };
  }

  static forFeature() {
    return {
      module: AuthModule,
      providers: [AccessTokenGuard, RolesGuard],
      exports: [AccessTokenGuard, RolesGuard],
    };
  }
}
