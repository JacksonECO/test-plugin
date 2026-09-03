import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ContextCoreService } from 'src/context/context-core.service';
import { LogCoreService } from 'src/log/log-core.service';
import { LogOptions } from 'src/options.dto';
export declare class LogRequestInterceptor implements NestInterceptor {
    private logService;
    private contextCoreService;
    private reflector;
    private logOption?;
    constructor(logService: LogCoreService, contextCoreService: ContextCoreService, reflector: Reflector, logOption?: LogOptions);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private getCorrelationId;
    private getIp;
    private buildRequestLog;
    private buildResponseLog;
}
