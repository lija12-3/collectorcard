"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SESModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESModule = void 0;
const common_1 = require("@nestjs/common");
const ses_service_1 = require("./ses.service");
let SESModule = SESModule_1 = class SESModule {
    static forRoot(region) {
        return {
            module: SESModule_1,
            providers: [
                {
                    provide: ses_service_1.SESService,
                    useFactory: () => new ses_service_1.SESService(region),
                },
            ],
            exports: [ses_service_1.SESService],
        };
    }
};
exports.SESModule = SESModule;
exports.SESModule = SESModule = SESModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: ses_service_1.SESService,
                useFactory: (region) => new ses_service_1.SESService(region),
            },
        ],
        exports: [ses_service_1.SESService],
    })
], SESModule);
//# sourceMappingURL=ses.module.js.map