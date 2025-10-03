"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheTTL = exports.CacheKey = exports.Cache = exports.CACHE_TTL_METADATA = exports.CACHE_KEY_METADATA = void 0;
const common_1 = require("@nestjs/common");
exports.CACHE_KEY_METADATA = 'cache_key';
exports.CACHE_TTL_METADATA = 'cache_ttl';
const Cache = (key, ttl = 300) => {
    return (target, propertyKey, descriptor) => {
        (0, common_1.SetMetadata)(exports.CACHE_KEY_METADATA, key)(target, propertyKey, descriptor);
        (0, common_1.SetMetadata)(exports.CACHE_TTL_METADATA, ttl)(target, propertyKey, descriptor);
        return descriptor;
    };
};
exports.Cache = Cache;
const CacheKey = (key) => (0, common_1.SetMetadata)(exports.CACHE_KEY_METADATA, key);
exports.CacheKey = CacheKey;
const CacheTTL = (ttl) => (0, common_1.SetMetadata)(exports.CACHE_TTL_METADATA, ttl);
exports.CacheTTL = CacheTTL;
//# sourceMappingURL=cache.decorator.js.map