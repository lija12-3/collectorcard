import { HighNoteService } from './services/highnote.service';
import { StripeService } from './services/stripe.service';
import { TwilioService } from './services/twilio.service';
export declare class ThirdPartyModule {
    static forRoot(configs: {
        highnote?: any;
        stripe?: any;
        twilio?: any;
    }): {
        module: typeof ThirdPartyModule;
        providers: ({
            provide: typeof HighNoteService;
            useFactory: () => HighNoteService;
        } | {
            provide: typeof StripeService;
            useFactory: () => StripeService;
        } | {
            provide: typeof TwilioService;
            useFactory: () => TwilioService;
        })[];
        exports: (typeof HighNoteService | typeof StripeService | typeof TwilioService)[];
    };
}
