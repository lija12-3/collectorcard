import { Module } from '@nestjs/common';
import { HighNoteService } from './services/highnote.service';
import { StripeService } from './services/stripe.service';
import { TwilioService } from './services/twilio.service';

@Module({
  providers: [
    {
      provide: HighNoteService,
      useFactory: (config: any) => new HighNoteService(config),
    },
    {
      provide: StripeService,
      useFactory: (config: any) => new StripeService(config),
    },
    {
      provide: TwilioService,
      useFactory: (config: any) => new TwilioService(config),
    },
  ],
  exports: [HighNoteService, StripeService, TwilioService],
})
export class ThirdPartyModule {
  static forRoot(configs: {
    highnote?: any;
    stripe?: any;
    twilio?: any;
  }) {
    return {
      module: ThirdPartyModule,
      providers: [
        {
          provide: HighNoteService,
          useFactory: () => new HighNoteService(configs.highnote),
        },
        {
          provide: StripeService,
          useFactory: () => new StripeService(configs.stripe),
        },
        {
          provide: TwilioService,
          useFactory: () => new TwilioService(configs.twilio),
        },
      ],
      exports: [HighNoteService, StripeService, TwilioService],
    };
  }
}
