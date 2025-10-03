import { Module } from '@nestjs/common';
import { SESService } from './ses.service';

@Module({
  providers: [
    {
      provide: SESService,
      useFactory: (region?: string) => new SESService(region),
    },
  ],
  exports: [SESService],
})
export class SESModule {
  static forRoot(region?: string) {
    return {
      module: SESModule,
      providers: [
        {
          provide: SESService,
          useFactory: () => new SESService(region),
        },
      ],
      exports: [SESService],
    };
  }
}
