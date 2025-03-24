import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LogCoreService } from 'src/log/log-core.service';
export declare class LogRequestInterceptor implements NestInterceptor {
    private logService;
    constructor(logService: LogCoreService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
