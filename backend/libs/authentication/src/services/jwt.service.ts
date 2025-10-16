import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { IJwtPayload, IUser, TokenType } from '../types/auth.types';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async generateToken(
    user: IUser,
    tokenType: TokenType = TokenType.ACCESS,
    expiresIn?: string,
  ): Promise<string> {
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.userroles,
      groups: [user.groupclaim],
      tokenType,
    };

    return this.jwtService.sign(payload as any, {
      expiresIn: (expiresIn || '1h') as any,
    });
  }

  async generateRefreshToken(user: IUser): Promise<string> {
    return this.generateToken(user, TokenType.REFRESH, '7d');
  }

  async verifyToken(token: string): Promise<IJwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async generateTokenPair(user: IUser): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(user, TokenType.ACCESS),
      this.generateRefreshToken(user),
    ]);

    return { accessToken, refreshToken };
  }
}
