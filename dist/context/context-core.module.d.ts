import { ContextCoreInterceptor } from './context-core.interceptor';
import { ContextCoreService } from './context-core.service';
export * from './context-core.service';
export declare class ContextCoreModule {
    static forRoot(): {
        module: typeof ContextCoreModule;
        providers: (typeof ContextCoreService | {
            provide: string;
            useClass: typeof ContextCoreInterceptor;
        })[];
    };
}
