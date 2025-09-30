import { JwtService as NestJwtService } from '@nestjs/jwt';
import { IJwtPayload, ICardinalUser, TokenType } from '../types/auth.types';
export declare class JwtService {
    private readonly jwtService;
    constructor(jwtService: NestJwtService);
    generateToken(user: ICardinalUser, tokenType?: TokenType, expiresIn?: string): Promise<string>;
    generateRefreshToken(user: ICardinalUser): Promise<string>;
    verifyToken(token: string): Promise<IJwtPayload>;
    generateTokenPair(user: ICardinalUser): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
