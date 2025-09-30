import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IRequest, IJwtPayload } from '../types/auth.types';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token not provided');
    }

    try {
      const payload: IJwtPayload = await this.jwtService.verifyAsync(token);
      request.token = payload;
      request.user = this.mapPayloadToUser(payload);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private mapPayloadToUser(payload: IJwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      userroles: payload.roles,
      groupclaim: payload.groups[0],
    };
  }
}
