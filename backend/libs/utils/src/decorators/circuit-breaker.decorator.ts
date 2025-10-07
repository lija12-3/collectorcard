import { SetMetadata } from '@nestjs/common';

export const CIRCUIT_BREAKER_METADATA = 'circuit_breaker';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  timeout?: number;
  resetTimeout?: number;
}

export const CircuitBreaker = (options: CircuitBreakerOptions = {}) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CIRCUIT_BREAKER_METADATA, {
      failureThreshold: options.failureThreshold || 5,
      timeout: options.timeout || 5000,
      resetTimeout: options.resetTimeout || 60000,
    })(target, propertyKey, descriptor);
    return descriptor;
  };
};
