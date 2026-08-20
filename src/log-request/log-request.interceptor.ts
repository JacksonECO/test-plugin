import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContextCoreService } from 'src/context/context-core.service';
import { LogCoreService } from 'src/log/log-core.service';
import { META_LOG_EXCLUDE, LogExcludeOptions } from './decorator/log-exclude.decorator';
import { removeFields } from './util/remove-fields';
import { redactFields } from './util/redact-fields';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  constructor(
    private logService: LogCoreService,
    private contextCoreService: ContextCoreService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const logExclude = this.reflector.getAllAndOverride<LogExcludeOptions>(META_LOG_EXCLUDE, [
      context.getClass(),
      context.getHandler(),
    ]);

    this.contextCoreService.set('setInfoRequest', (dto: any) => {
      request._info = dto;
    });

    return next.handle().pipe(
      tap((response) => {
        const responseHttp = httpContext.getResponse();

        this.logService.salvarRequest({
          url: request.path || request.config?.url || request.url,
          method: request.method,
          request: this.buildRequestLog(request, logExclude),
          response: this.buildResponseLog(response, logExclude),
          statusCode: responseHttp?.statusCode,
          info: request._info,
        });
      }),
      catchError((error) => {
        delete error.response?.req;

        this.logService.salvarRequest({
          url: request.path || request.config?.url || request.url,
          method: request.method,
          statusCode: error.status || 500,
          request: this.buildRequestLog(request, logExclude),
          response: this.buildResponseLog(error.response || error.message, logExclude),
          info: request._info,
        });

        throw error;
      }),
    );
  }

  private buildRequestLog(request: any, logExclude?: LogExcludeOptions): any {
    if (logExclude?.excludeRequest) {
      return undefined;
    }

    const requestFormat = {
      body: request?.body,
      params: request?.params,
      query: request?.query,
    };

    const semCamposRemovidos = removeFields(requestFormat, logExclude?.requestFields);
    return redactFields(semCamposRemovidos, logExclude?.requestFieldsRedact);
  }

  private buildResponseLog(response: any, logExclude?: LogExcludeOptions): any {
    if (logExclude?.excludeResponse) {
      return undefined;
    }

    const semCamposRemovidos = removeFields(response, logExclude?.responseFields);
    return redactFields(semCamposRemovidos, logExclude?.responseFieldsRedact);
  }
}
