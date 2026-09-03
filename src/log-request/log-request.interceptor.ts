import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContextCoreService } from 'src/context/context-core.service';
import { CONTEXT_CORRELATION_ID, LogCoreService } from 'src/log/log-core.service';
import { META_LOG_CUSTOM, LogCustomOptions } from './decorator/log-custom.decorator';
import { removeFields } from './util/remove-fields';
import { redactFields } from './util/redact-fields';
import { CORE_LOG_OPTION } from 'src/constants';
import { LogOptions } from 'src/options.dto';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  constructor(
    private logService: LogCoreService,
    private contextCoreService: ContextCoreService,
    private reflector: Reflector,
    @Optional() @Inject(CORE_LOG_OPTION) private logOption?: LogOptions,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const logCustom = this.reflector.getAllAndOverride<LogCustomOptions>(META_LOG_CUSTOM, [
      context.getClass(),
      context.getHandler(),
    ]);

    this.contextCoreService.set('setInfoRequest', (dto: any) => {
      request._info = dto;
    });

    const correlationId = this.getCorrelationId(request);
    if (correlationId) {
      // Propaga para que logs manuais (`salvarLog`) da mesma request também tenham o id
      this.contextCoreService.set(CONTEXT_CORRELATION_ID, correlationId);
    }

    return next.handle().pipe(
      tap((response) => {
        const responseHttp = httpContext.getResponse();
        const isSucesso = responseHttp?.statusCode >= 200 && responseHttp?.statusCode < 300;

        if (isSucesso && logCustom?.salvarSucesso === false) {
          return;
        }

        this.logService.salvarRequest({
          url: request.path || request.config?.url || request.url,
          method: request.method,
          tipo: logCustom?.tipo,
          message: logCustom?.mensagem,
          ip: this.getIp(request),
          correlationId,
          request: this.buildRequestLog(request, logCustom),
          response: this.buildResponseLog(response, isSucesso, logCustom),
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
          tipo: logCustom?.tipo,
          message: logCustom?.mensagem,
          ip: this.getIp(request),
          correlationId,
          request: this.buildRequestLog(request, logCustom),
          response: this.buildResponseLog(error.response || error.message, false, logCustom),
          info: request._info,
        });

        throw error;
      }),
    );
  }

  /**
   * Id de correlação lido do header configurado em `LogOptions.correlationIdHeader`.
   * Retorna `undefined` quando a captura não está habilitada.
   */
  private getCorrelationId(request: any): string | undefined {
    if (!this.logOption?.salvarCorrelationId) {
      return undefined;
    }

    const header = this.logOption.correlationIdHeader ?? 'x-correlation-id';
    const valor = request?.headers?.[header] ?? request?.headers?.[header.toLowerCase()];

    return Array.isArray(valor) ? valor[0] : valor;
  }

  /**
   * IP de origem da requisição. Retorna `undefined` quando a captura não está habilitada.
   */
  private getIp(request: any): string | undefined {
    if (!this.logOption?.salvarIp) {
      return undefined;
    }

    const ipAddr = request?.headers?.['x-forwarded-for'] || request?.socket?.remoteAddress;
    if (!ipAddr) {
      return undefined;
    }

    const list = String(ipAddr).split(',');
    return list[list.length - 1].trim().replace('::ffff:', '');
  }

  private buildRequestLog(request: any, logCustom?: LogCustomOptions): any {
    if (logCustom?.excluirRequest) {
      return undefined;
    }

    const requestFormat = {
      body: request?.body,
      params: request?.params,
      query: request?.query,
    };

    const semCamposRemovidos = removeFields(requestFormat, logCustom?.excluirCampoRequest);
    return redactFields(semCamposRemovidos, logCustom?.mascararCampoRequest);
  }

  private buildResponseLog(response: any, isSucesso: boolean, logCustom?: LogCustomOptions): any {
    if (logCustom?.excluirResponse) {
      return undefined;
    }

    if (isSucesso && logCustom?.salvarResponseSucesso === false) {
      return undefined;
    }

    const semCamposRemovidos = removeFields(response, logCustom?.excluirCampoResponse);
    return redactFields(semCamposRemovidos, logCustom?.mascararCampoResponse);
  }
}
