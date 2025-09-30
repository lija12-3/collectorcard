import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
// Create a simple error response function locally to avoid import issues
function createErrorResponse(error: string, message?: string) {
  return {
    success: false,
    data: undefined,
    error,
    message,
    timestamp: new Date().toISOString(),
  };
}

@Catch()
export class BffExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BffExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;
        error = responseObj.error || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = 'UNKNOWN_ERROR';
    }

    // Log the error
    this.logger.error(
      `Exception caught: ${error} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Create standardized error response
    const errorResponse = createErrorResponse(message, error);

    // Add additional context for debugging
    if (process.env.NODE_ENV === 'development') {
      (errorResponse as any).stack = exception instanceof Error ? exception.stack : undefined;
      (errorResponse as any).path = request.url;
      (errorResponse as any).method = request.method;
      (errorResponse as any).timestamp = new Date().toISOString();
    }

    response.status(status).json(errorResponse);
  }
}
