import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
export declare class LogConsoleInterceptor implements NestInterceptor {
    private readonly requestInfoCoreService;
    private readonly reflector;
    private logger;
    constructor(requestInfoCoreService: RequestInfoCoreService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private formatRequestBody;
    private formatResponse;
    private getIP;
}
