"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var KeystoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeystoreModule = void 0;
const common_1 = require("@nestjs/common");
const keystore_service_1 = require("./keystore.service");
let KeystoreModule = KeystoreModule_1 = class KeystoreModule {
    static forRoot(region) {
        return {
            module: KeystoreModule_1,
            providers: [
                {
                    provide: keystore_service_1.KeystoreService,
                    useFactory: () => new keystore_service_1.KeystoreService(region),
                },
            ],
            exports: [keystore_service_1.KeystoreService],
        };
    }
};
exports.KeystoreModule = KeystoreModule;
exports.KeystoreModule = KeystoreModule = KeystoreModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: keystore_service_1.KeystoreService,
                useFactory: (region) => new keystore_service_1.KeystoreService(region),
            },
        ],
        exports: [keystore_service_1.KeystoreService],
    })
], KeystoreModule);
//# sourceMappingURL=keystore.module.js.map