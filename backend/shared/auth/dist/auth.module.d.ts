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
export declare class AuthModule {
    static forRoot(options: IAuthModuleOptions): {
        module: typeof AuthModule;
        imports: (typeof PassportModule | import("@nestjs/common").DynamicModule)[];
        providers: (typeof JwtService | typeof AccessTokenGuard | typeof RolesGuard | {
            provide: string;
            useValue: IAuthConfig;
            useFactory?: undefined;
            inject?: undefined;
        } | {
            provide: string;
            useValue: string;
            useFactory?: undefined;
            inject?: undefined;
        } | {
            provide: typeof EncryptionService;
            useFactory: (encryptionKey: string) => EncryptionService;
            inject: string[];
            useValue?: undefined;
        })[];
        exports: (typeof JwtService | typeof EncryptionService | typeof AccessTokenGuard | typeof RolesGuard)[];
    };
    static forFeature(): {
        module: typeof AuthModule;
        providers: (typeof AccessTokenGuard | typeof RolesGuard)[];
        exports: (typeof AccessTokenGuard | typeof RolesGuard)[];
    };
}
