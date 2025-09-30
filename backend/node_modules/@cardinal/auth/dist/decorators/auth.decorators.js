"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireAuth = exports.Public = exports.Groups = exports.Roles = exports.PUBLIC_KEY = exports.GROUPS_KEY = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
exports.GROUPS_KEY = 'groups';
exports.PUBLIC_KEY = 'isPublic';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
const Groups = (...groups) => (0, common_1.SetMetadata)(exports.GROUPS_KEY, groups);
exports.Groups = Groups;
const Public = () => (0, common_1.SetMetadata)(exports.PUBLIC_KEY, true);
exports.Public = Public;
const RequireAuth = () => (0, common_1.SetMetadata)(exports.PUBLIC_KEY, false);
exports.RequireAuth = RequireAuth;
//# sourceMappingURL=auth.decorators.js.map