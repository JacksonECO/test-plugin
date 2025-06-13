import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContextCoreService } from 'src/context/context-core.service';
import { LogCoreService } from 'src/log/log-core.service';
export declare class LogRequestInterceptor implements NestInterceptor {
  private logService;
  private contextCoreService;
  constructor(logService: LogCoreService, contextCoreService: ContextCoreService);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
