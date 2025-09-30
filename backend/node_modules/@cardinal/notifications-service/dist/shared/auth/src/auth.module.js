"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const jwt_service_1 = require("./services/jwt.service");
const encryption_service_1 = require("./services/encryption.service");
const access_token_guard_1 = require("./guards/access-token.guard");
const roles_guard_1 = require("./guards/roles.guard");
let AuthModule = AuthModule_1 = class AuthModule {
    static forRoot(options) {
        return {
            module: AuthModule_1,
            imports: [
                passport_1.PassportModule,
                jwt_1.JwtModule.register({
                    secret: options.config.jwtSecret,
                    signOptions: {
                        expiresIn: options.config.jwtExpiresIn,
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
                jwt_service_1.JwtService,
                {
                    provide: encryption_service_1.EncryptionService,
                    useFactory: (encryptionKey) => new encryption_service_1.EncryptionService(encryptionKey),
                    inject: ['EncryptionKey'],
                },
                access_token_guard_1.AccessTokenGuard,
                roles_guard_1.RolesGuard,
            ],
            exports: [
                jwt_service_1.JwtService,
                encryption_service_1.EncryptionService,
                access_token_guard_1.AccessTokenGuard,
                roles_guard_1.RolesGuard,
            ],
        };
    }
    static forFeature() {
        return {
            module: AuthModule_1,
            providers: [access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard],
            exports: [access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard],
        };
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = AuthModule_1 = __decorate([
    (0, common_1.Module)({})
], AuthModule);
//# sourceMappingURL=auth.module.js.map