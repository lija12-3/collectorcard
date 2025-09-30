"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SQSModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQSModule = void 0;
const common_1 = require("@nestjs/common");
const sqs_service_1 = require("./sqs.service");
let SQSModule = SQSModule_1 = class SQSModule {
    static forRoot(region) {
        return {
            module: SQSModule_1,
            providers: [
                {
                    provide: sqs_service_1.SQSService,
                    useFactory: () => new sqs_service_1.SQSService(region),
                },
            ],
            exports: [sqs_service_1.SQSService],
        };
    }
};
exports.SQSModule = SQSModule;
exports.SQSModule = SQSModule = SQSModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: sqs_service_1.SQSService,
                useFactory: (region) => new sqs_service_1.SQSService(region),
            },
        ],
        exports: [sqs_service_1.SQSService],
    })
], SQSModule);
//# sourceMappingURL=sqs.module.js.map