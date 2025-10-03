import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CIRCUIT_BREAKER_METADATA, CircuitBreakerOptions } from '../decorators/circuit-breaker.decorator';

interface CircuitState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime?: Date;
  nextAttemptTime?: Date;
}

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CircuitBreakerInterceptor.name);
  private circuits = new Map<string, CircuitState>();

  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get<CircuitBreakerOptions>(
      CIRCUIT_BREAKER_METADATA,
      context.getHandler(),
    );

    if (!options) {
      return next.handle();
    }

    const methodName = `${context.getClass().name}.${context.getHandler().name}`;
    const circuit = this.getOrCreateCircuit(methodName, options);

    if (this.isCircuitOpen(circuit)) {
      this.logger.warn(`Circuit breaker is OPEN for ${methodName}`);
      return throwError(
        () => new HttpException('Service temporarily unavailable', HttpStatus.SERVICE_UNAVAILABLE),
      );
    }

    return next.handle().pipe(
      catchError((error) => {
        this.recordFailure(circuit, options);
        this.logger.error(`Circuit breaker recorded failure for ${methodName}: ${error.message}`);
        return throwError(() => error);
      }),
      switchMap((data) => {
        this.recordSuccess(circuit);
        return [data];
      }),
    );
  }

  private getOrCreateCircuit(methodName: string, options: CircuitBreakerOptions): CircuitState {
    if (!this.circuits.has(methodName)) {
      this.circuits.set(methodName, {
        state: 'CLOSED',
        failureCount: 0,
      });
    }
    return this.circuits.get(methodName)!;
  }

  private isCircuitOpen(circuit: CircuitState): boolean {
    if (circuit.state === 'OPEN') {
      if (circuit.nextAttemptTime && new Date() > circuit.nextAttemptTime) {
        circuit.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  private recordFailure(circuit: CircuitState, options: CircuitBreakerOptions): void {
    circuit.failureCount++;
    circuit.lastFailureTime = new Date();

    if (circuit.failureCount >= options.failureThreshold!) {
      circuit.state = 'OPEN';
      circuit.nextAttemptTime = new Date(Date.now() + options.resetTimeout!);
      this.logger.warn(`Circuit breaker opened after ${circuit.failureCount} failures`);
    }
  }

  private recordSuccess(circuit: CircuitState): void {
    circuit.failureCount = 0;
    circuit.state = 'CLOSED';
  }

  getCircuitState(methodName: string): CircuitState | undefined {
    return this.circuits.get(methodName);
  }

  resetCircuit(methodName: string): void {
    this.circuits.delete(methodName);
  }
}
