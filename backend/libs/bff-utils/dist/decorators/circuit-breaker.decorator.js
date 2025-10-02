"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = exports.CIRCUIT_BREAKER_METADATA = void 0;
const common_1 = require("@nestjs/common");
exports.CIRCUIT_BREAKER_METADATA = 'circuit_breaker';
const CircuitBreaker = (options = {}) => {
    return (target, propertyKey, descriptor) => {
        (0, common_1.SetMetadata)(exports.CIRCUIT_BREAKER_METADATA, {
            failureThreshold: options.failureThreshold || 5,
            timeout: options.timeout || 5000,
            resetTimeout: options.resetTimeout || 60000,
        })(target, propertyKey, descriptor);
        return descriptor;
    };
};
exports.CircuitBreaker = CircuitBreaker;
//# sourceMappingURL=circuit-breaker.decorator.js.map