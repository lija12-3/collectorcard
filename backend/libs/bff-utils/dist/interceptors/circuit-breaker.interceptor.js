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
var CircuitBreakerInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreakerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const circuit_breaker_decorator_1 = require("../decorators/circuit-breaker.decorator");
let CircuitBreakerInterceptor = CircuitBreakerInterceptor_1 = class CircuitBreakerInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
        this.logger = new common_1.Logger(CircuitBreakerInterceptor_1.name);
        this.circuits = new Map();
    }
    intercept(context, next) {
        const options = this.reflector.get(circuit_breaker_decorator_1.CIRCUIT_BREAKER_METADATA, context.getHandler());
        if (!options) {
            return next.handle();
        }
        const methodName = `${context.getClass().name}.${context.getHandler().name}`;
        const circuit = this.getOrCreateCircuit(methodName, options);
        if (this.isCircuitOpen(circuit)) {
            this.logger.warn(`Circuit breaker is OPEN for ${methodName}`);
            return (0, rxjs_1.throwError)(() => new common_1.HttpException('Service temporarily unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE));
        }
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            this.recordFailure(circuit, options);
            this.logger.error(`Circuit breaker recorded failure for ${methodName}: ${error.message}`);
            return (0, rxjs_1.throwError)(() => error);
        }), (0, operators_1.switchMap)((data) => {
            this.recordSuccess(circuit);
            return [data];
        }));
    }
    getOrCreateCircuit(methodName, options) {
        if (!this.circuits.has(methodName)) {
            this.circuits.set(methodName, {
                state: 'CLOSED',
                failureCount: 0,
            });
        }
        return this.circuits.get(methodName);
    }
    isCircuitOpen(circuit) {
        if (circuit.state === 'OPEN') {
            if (circuit.nextAttemptTime && new Date() > circuit.nextAttemptTime) {
                circuit.state = 'HALF_OPEN';
                return false;
            }
            return true;
        }
        return false;
    }
    recordFailure(circuit, options) {
        circuit.failureCount++;
        circuit.lastFailureTime = new Date();
        if (circuit.failureCount >= options.failureThreshold) {
            circuit.state = 'OPEN';
            circuit.nextAttemptTime = new Date(Date.now() + options.resetTimeout);
            this.logger.warn(`Circuit breaker opened after ${circuit.failureCount} failures`);
        }
    }
    recordSuccess(circuit) {
        circuit.failureCount = 0;
        circuit.state = 'CLOSED';
    }
    getCircuitState(methodName) {
        return this.circuits.get(methodName);
    }
    resetCircuit(methodName) {
        this.circuits.delete(methodName);
    }
};
exports.CircuitBreakerInterceptor = CircuitBreakerInterceptor;
exports.CircuitBreakerInterceptor = CircuitBreakerInterceptor = CircuitBreakerInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], CircuitBreakerInterceptor);
//# sourceMappingURL=circuit-breaker.interceptor.js.map