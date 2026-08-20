import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ContextCoreService } from 'src/context/context-core.service';
import { LogCoreService } from 'src/log/log-core.service';
export declare class LogRequestInterceptor implements NestInterceptor {
    private logService;
    private contextCoreService;
    private reflector;
    constructor(logService: LogCoreService, contextCoreService: ContextCoreService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private buildRequestLog;
    private buildResponseLog;
}
