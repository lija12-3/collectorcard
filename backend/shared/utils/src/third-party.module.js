"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ThirdPartyModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyModule = void 0;
const common_1 = require("@nestjs/common");
const highnote_service_1 = require("./services/highnote.service");
const stripe_service_1 = require("./services/stripe.service");
const twilio_service_1 = require("./services/twilio.service");
let ThirdPartyModule = ThirdPartyModule_1 = class ThirdPartyModule {
    static forRoot(configs) {
        return {
            module: ThirdPartyModule_1,
            providers: [
                {
                    provide: highnote_service_1.HighNoteService,
                    useFactory: () => new highnote_service_1.HighNoteService(configs.highnote),
                },
                {
                    provide: stripe_service_1.StripeService,
                    useFactory: () => new stripe_service_1.StripeService(configs.stripe),
                },
                {
                    provide: twilio_service_1.TwilioService,
                    useFactory: () => new twilio_service_1.TwilioService(configs.twilio),
                },
            ],
            exports: [highnote_service_1.HighNoteService, stripe_service_1.StripeService, twilio_service_1.TwilioService],
        };
    }
};
exports.ThirdPartyModule = ThirdPartyModule;
exports.ThirdPartyModule = ThirdPartyModule = ThirdPartyModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: highnote_service_1.HighNoteService,
                useFactory: (config) => new highnote_service_1.HighNoteService(config),
            },
            {
                provide: stripe_service_1.StripeService,
                useFactory: (config) => new stripe_service_1.StripeService(config),
            },
            {
                provide: twilio_service_1.TwilioService,
                useFactory: (config) => new twilio_service_1.TwilioService(config),
            },
        ],
        exports: [highnote_service_1.HighNoteService, stripe_service_1.StripeService, twilio_service_1.TwilioService],
    })
], ThirdPartyModule);
//# sourceMappingURL=third-party.module.js.map