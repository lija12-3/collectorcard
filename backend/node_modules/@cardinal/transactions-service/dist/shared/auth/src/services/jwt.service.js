"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_types_1 = require("../types/auth.types");
let JwtService = class JwtService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async generateToken(user, tokenType = auth_types_1.TokenType.ACCESS, expiresIn) {
        const payload = {
            sub: user.id,
            email: user.email,
            roles: user.userroles,
            groups: [user.groupclaim],
            tokenType,
        };
        return this.jwtService.sign(payload, {
            expiresIn: expiresIn || '1h',
        });
    }
    async generateRefreshToken(user) {
        return this.generateToken(user, auth_types_1.TokenType.REFRESH, '7d');
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    async generateTokenPair(user) {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateToken(user, auth_types_1.TokenType.ACCESS),
            this.generateRefreshToken(user),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], JwtService);
//# sourceMappingURL=jwt.service.js.map