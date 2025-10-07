import { Request } from 'express';

export enum ApiAuthenticationMethod {
  Bearer = 'Bearer',
  Ghost = 'Ghost',
  CustomAPI = 'CustomAPI',
  ExternalAPI = 'ExternalAPI',
}

export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  CHANGEPASSWORD = 'CHANGEPASSWORD',
  VERIFYEMAIL = 'VERIFYEMAIL',
  APIACCESS = 'APIACCESS',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  VIEWER = 'VIEWER',
}

export enum UserGroups {
  ADMINISTRATORS = 'ADMINISTRATORS',
  MANAGERS = 'MANAGERS',
  USERS = 'USERS',
  VIEWERS = 'VIEWERS',
}

export interface ITokenBodyBase {
  sub: string;
  tokenclaim: TokenType;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export interface IUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  userroles: Role[];
  groupclaim: UserGroups;
  passwordhash?: string;
  [key: string]: any;
}

export interface IRequest extends Request {
  token?: ITokenBodyBase;
  rawtoken?: string;
  user?: IUser;
  useraudit?: {
    auditdate: number;
    useremail: string;
    username: string;
    ipaddress?: string;
  };
}

export interface IAuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  encryptionKey: string;
  awsKmsKeyId?: string;
  ghostKey?: string;
  customAPIKey?: string;
  rateLimit?: {
    windowMs: number;
    max: number;
  };
}

export interface IRequestValidator {
  params?: any;
  query?: any;
  body?: any;
  headers?: any;
}

export interface IResponseData {
  data?: any;
  error?: any;
  message?: string;
  [key: string]: any;
}

export interface IAuditLog {
  timestamp: Date;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  groups: UserGroups[];
  tokenType: TokenType;
  iat?: number;
  exp?: number;
}
