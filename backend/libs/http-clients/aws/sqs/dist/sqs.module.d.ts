import { SQSService } from './sqs.service';
export declare class SQSModule {
    static forRoot(region?: string): {
        module: typeof SQSModule;
        providers: {
            provide: typeof SQSService;
            useFactory: () => SQSService;
        }[];
        exports: (typeof SQSService)[];
    };
}
