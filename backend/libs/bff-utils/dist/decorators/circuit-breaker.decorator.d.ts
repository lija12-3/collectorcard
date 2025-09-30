export declare const CIRCUIT_BREAKER_METADATA = "circuit_breaker";
export interface CircuitBreakerOptions {
    failureThreshold?: number;
    timeout?: number;
    resetTimeout?: number;
}
export declare const CircuitBreaker: (options?: CircuitBreakerOptions) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
