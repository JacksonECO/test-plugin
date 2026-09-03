import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
import { LogConsoleOptions } from 'src/options.dto';
export declare class LogConsoleInterceptor implements NestInterceptor {
    private readonly requestInfoCoreService;
    private readonly reflector;
    private readonly option?;
    private logger;
    constructor(requestInfoCoreService: RequestInfoCoreService, reflector: Reflector, option?: LogConsoleOptions);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private logSucesso;
    private isLogAtivo;
    private isRotaIgnorada;
    private getOrigem;
    private formatRequestBody;
    private formatResponse;
    private getIP;
}
