import { Module } from '@nestjs/common';
import { KeystoreService } from './keystore.service';

@Module({
  providers: [
    {
      provide: KeystoreService,
      useFactory: (region?: string) => new KeystoreService(region),
    },
  ],
  exports: [KeystoreService],
})
export class KeystoreModule {
  static forRoot(region?: string) {
    return {
      module: KeystoreModule,
      providers: [
        {
          provide: KeystoreService,
          useFactory: () => new KeystoreService(region),
        },
      ],
      exports: [KeystoreService],
    };
  }
}
