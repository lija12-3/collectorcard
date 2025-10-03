"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BffExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BffExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../../../../shared/utils");
let BffExceptionFilter = BffExceptionFilter_1 = class BffExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(BffExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'INTERNAL_SERVER_ERROR';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse;
                message = responseObj.message || responseObj.error || message;
                error = responseObj.error || error;
            }
        }
        else if (exception instanceof Error) {
            message = exception.message;
            error = 'UNKNOWN_ERROR';
        }
        this.logger.error(`Exception caught: ${error} - ${message}`, exception instanceof Error ? exception.stack : undefined);
        const errorResponse = (0, utils_1.createErrorResponse)(message, error);
        if (process.env.NODE_ENV === 'development') {
            errorResponse.stack = exception instanceof Error ? exception.stack : undefined;
            errorResponse.path = request.url;
            errorResponse.method = request.method;
            errorResponse.timestamp = new Date().toISOString();
        }
        response.status(status).json(errorResponse);
    }
};
exports.BffExceptionFilter = BffExceptionFilter;
exports.BffExceptionFilter = BffExceptionFilter = BffExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], BffExceptionFilter);
//# sourceMappingURL=bff-exception.filter.js.map