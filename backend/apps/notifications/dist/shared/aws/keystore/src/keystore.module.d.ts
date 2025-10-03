import { KeystoreService } from './keystore.service';
export declare class KeystoreModule {
    static forRoot(region?: string): {
        module: typeof KeystoreModule;
        providers: {
            provide: typeof KeystoreService;
            useFactory: () => KeystoreService;
        }[];
        exports: (typeof KeystoreService)[];
    };
}
