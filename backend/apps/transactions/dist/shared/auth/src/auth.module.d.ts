import { DynamicModule } from '@nestjs/common';
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
    static forRoot(options: IAuthModuleOptions): DynamicModule;
    static forFeature(): {
        module: typeof AuthModule;
        providers: (typeof AccessTokenGuard | typeof RolesGuard)[];
        exports: (typeof AccessTokenGuard | typeof RolesGuard)[];
    };
}
