import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContextCoreService } from 'src/context/context-core.service';
import { LogCoreService } from 'src/log/log-core.service';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  constructor(
    private logService: LogCoreService,
    private contextCoreService: ContextCoreService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    this.contextCoreService.set('setInfoRequest', (dto: any) => {
      request._info = dto;
    });

    return next.handle().pipe(
      tap((response) => {
        const responseHttp = httpContext.getResponse();

        const requestFormat = {
          body: request?.body,
          params: request?.params,
          query: request?.query,
        };

        this.logService.salvarRequest({
          url: request.path || request.config?.url || request.url,
          method: request.method,
          request: requestFormat,
          response: response,
          statusCode: responseHttp?.statusCode,
          info: request._info,
        });
      }),
      catchError((error) => {
        const requestFormat = {
          body: request?.body,
          params: request?.params,
          query: request?.query,
        };

        this.logService.salvarRequest({
          url: request.path || request.config?.url || request.url,
          method: request.method,
          statusCode: error.status || 500,
          request: requestFormat,
          response: error.response || error.message,
          info: request._info,
        });

        throw error;
      }),
    );
  }
}
