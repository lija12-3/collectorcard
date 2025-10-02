import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
interface CircuitState {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    lastFailureTime?: Date;
    nextAttemptTime?: Date;
}
export declare class CircuitBreakerInterceptor implements NestInterceptor {
    private reflector;
    private readonly logger;
    private circuits;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private getOrCreateCircuit;
    private isCircuitOpen;
    private recordFailure;
    private recordSuccess;
    getCircuitState(methodName: string): CircuitState | undefined;
    resetCircuit(methodName: string): void;
}
export {};
