import { Module } from '@nestjs/common';
import { SNSService } from './sns.service';

@Module({
  providers: [
    {
      provide: SNSService,
      useFactory: (region?: string) => new SNSService(region),
    },
  ],
  exports: [SNSService],
})
export class SNSModule {
  static forRoot(region?: string) {
    return {
      module: SNSModule,
      providers: [
        {
          provide: SNSService,
          useFactory: () => new SNSService(region),
        },
      ],
      exports: [SNSService],
    };
  }
}
