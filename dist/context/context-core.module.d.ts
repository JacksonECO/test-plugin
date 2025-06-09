import { ContextCoreInterceptor } from './context-core.interceptor';
export * from './context-core.service';
export declare class ContextCoreModule {
  static interceptor(): {
    provide: string;
    useClass: typeof ContextCoreInterceptor;
  };
}
