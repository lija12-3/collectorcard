import { Module } from '@nestjs/common';
import { SQSService } from './sqs.service';

@Module({
  providers: [
    {
      provide: SQSService,
      useFactory: (region?: string) => new SQSService(region),
    },
  ],
  exports: [SQSService],
})
export class SQSModule {
  static forRoot(region?: string) {
    return {
      module: SQSModule,
      providers: [
        {
          provide: SQSService,
          useFactory: () => new SQSService(region),
        },
      ],
      exports: [SQSService],
    };
  }
}
