import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContextCoreService } from './context-core.service';
export declare class ContextCoreInterceptor implements NestInterceptor {
    private readonly contextService;
    constructor(contextService: ContextCoreService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
