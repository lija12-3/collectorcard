import { SNSService } from './sns.service';
export declare class SNSModule {
    static forRoot(region?: string): {
        module: typeof SNSModule;
        providers: {
            provide: typeof SNSService;
            useFactory: () => SNSService;
        }[];
        exports: (typeof SNSService)[];
    };
}
