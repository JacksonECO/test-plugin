import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
export declare class LogConsoleInterceptor implements NestInterceptor {
    private readonly requestInfoCoreService;
    private logger;
    constructor(requestInfoCoreService: RequestInfoCoreService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private getIP;
}
