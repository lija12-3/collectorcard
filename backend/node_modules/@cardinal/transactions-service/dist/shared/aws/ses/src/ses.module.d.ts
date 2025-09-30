import { SESService } from './ses.service';
export declare class SESModule {
    static forRoot(region?: string): {
        module: typeof SESModule;
        providers: {
            provide: typeof SESService;
            useFactory: () => SESService;
        }[];
        exports: (typeof SESService)[];
    };
}
