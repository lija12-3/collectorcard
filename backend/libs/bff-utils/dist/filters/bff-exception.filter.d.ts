import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class BffExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
}
