import { Role, CardinalUserGroups } from '../types/auth.types';
export declare const ROLES_KEY = "roles";
export declare const GROUPS_KEY = "groups";
export declare const PUBLIC_KEY = "isPublic";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const Groups: (...groups: CardinalUserGroups[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireAuth: () => import("@nestjs/common").CustomDecorator<string>;
