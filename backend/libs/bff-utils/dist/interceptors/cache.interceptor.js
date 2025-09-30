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
var CacheInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const cache_decorator_1 = require("../decorators/cache.decorator");
let CacheInterceptor = CacheInterceptor_1 = class CacheInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
        this.logger = new common_1.Logger(CacheInterceptor_1.name);
        this.cache = new Map();
    }
    intercept(context, next) {
        const cacheKey = this.reflector.get(cache_decorator_1.CACHE_KEY_METADATA, context.getHandler());
        const cacheTTL = this.reflector.get(cache_decorator_1.CACHE_TTL_METADATA, context.getHandler());
        if (!cacheKey || !cacheTTL) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const fullCacheKey = `${cacheKey}:${JSON.stringify(request.query)}:${JSON.stringify(request.params)}`;
        const cached = this.cache.get(fullCacheKey);
        if (cached && cached.expiry > Date.now()) {
            this.logger.log(`Cache hit for key: ${fullCacheKey}`);
            return (0, rxjs_1.of)(cached.data);
        }
        this.logger.log(`Cache miss for key: ${fullCacheKey}`);
        return next.handle().pipe((0, operators_1.tap)((data) => {
            this.cache.set(fullCacheKey, {
                data,
                expiry: Date.now() + cacheTTL * 1000,
            });
            this.cleanupExpiredEntries();
        }));
    }
    cleanupExpiredEntries() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (value.expiry <= now) {
                this.cache.delete(key);
            }
        }
    }
    clearCache(pattern) {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        }
        else {
            this.cache.clear();
        }
    }
};
exports.CacheInterceptor = CacheInterceptor;
exports.CacheInterceptor = CacheInterceptor = CacheInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], CacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map