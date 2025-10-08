import { SetMetadata } from '@nestjs/common';
import { Role, UserGroups } from '../types/auth.types';

export const ROLES_KEY = 'roles';
export const GROUPS_KEY = 'groups';
export const PUBLIC_KEY = 'isPublic';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const Groups = (...groups: UserGroups[]) => SetMetadata(GROUPS_KEY, groups);

export const Public = () => SetMetadata(PUBLIC_KEY, true);

export const RequireAuth = () => SetMetadata(PUBLIC_KEY, false);
