import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
import { META_LOG_CUSTOM, LogCustomOptions } from 'src/log-request/decorator/log-custom.decorator';
import { removeFields } from 'src/log-request/util/remove-fields';
import { redactFields } from 'src/log-request/util/redact-fields';
import { CORE_LOG_CONSOLE_OPTION } from 'src/constants';
import { LogConsoleOptions } from 'src/options.dto';

const OMITIDO = '"[omitido]"';

@Injectable()
export class LogConsoleInterceptor implements NestInterceptor {
  private logger: Logger;

  constructor(
    private readonly requestInfoCoreService: RequestInfoCoreService,
    private readonly reflector: Reflector,
    @Optional() @Inject(CORE_LOG_CONSOLE_OPTION) private readonly option?: LogConsoleOptions,
  ) {
    this.logger = new Logger(this.option?.contexto ?? 'LoggingInterceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const responseHttp = httpContext.getResponse();
    const routePath = request.path || request.config?.url || request.url;
    const routePathClean = routePath?.includes('?') ? routePath.substring(0, routePath.indexOf('?')) : routePath;

    const logCustom = this.reflector.getAllAndOverride<LogCustomOptions>(META_LOG_CUSTOM, [
      context.getClass(),
      context.getHandler(),
    ]);

    const ip = this.getIP(request);
    const origem = this.getOrigem(ip);
    const logarSucesso = this.isLogAtivo() && !this.isRotaIgnorada(routePathClean);

    if (logarSucesso) {
      const formattedRequestBody = this.formatRequestBody(request, logCustom);

      this.logSucesso(
        `Start Request for ${routePathClean}\nmethod=${request.method} ${origem}\n${formattedRequestBody}`,
      );
    }

    return next.handle().pipe(
      tap((response) => {
        const isSucesso = responseHttp?.statusCode >= 200 && responseHttp?.statusCode < 300;

        if (!logarSucesso || (isSucesso && logCustom?.salvarSucesso === false)) {
          return;
        }

        const bigResponse = this.formatResponse(response, logCustom);

        this.logSucesso(
          `End Request for ${routePathClean}\nmethod=${request.method}::${
            responseHttp?.statusCode ?? ''
          } ${origem} duration=${Date.now() - now}ms\n${bigResponse}`,
        );
      }),
      catchError((error) => {
        if (error.response) {
          error.response.request = undefined;
        }

        // Sempre loga erros, independente das rotas ignoradas ou do log de sucesso estar desabilitado
        this.logger.error(
          `Error on route=${routePathClean} status=${error.status} ${origem} duration=${
            Date.now() - now
          }ms\n${this.formatResponse(error.response || error.message, logCustom)}`,
          error?.stack?.toString() ?? '',
        );

        throw error;
      }),
    );
  }

  /**
   * Loga no nível configurado (`verbose` por padrão) as informações de request/response de sucesso.
   */
  private logSucesso(message: string): void {
    const nivel = this.option?.nivel ?? 'verbose';
    this.logger[nivel](message);
  }

  /**
   * Indica se o log de sucesso está habilitado: usa a opção `habilitado` quando informada,
   * caindo para a env `LOG_REQUEST` (ativa quando ausente ou igual a `'true'`).
   */
  private isLogAtivo(): boolean {
    if (this.option?.habilitado != null) {
      return this.option.habilitado;
    }

    return !process.env.LOG_REQUEST || process.env.LOG_REQUEST == 'true';
  }

  private isRotaIgnorada(routePath: unknown): boolean {
    const rotas = this.option?.rotasIgnoradas ?? [];
    if (!rotas.length || typeof routePath !== 'string') {
      return false;
    }

    return rotas.some((rota) => routePath.startsWith(rota));
  }

  /**
   * Identificação de quem fez a request: sempre o IP e, quando houver usuário autenticado, o e-mail.
   */
  private getOrigem(ip: string): string {
    const email = this.requestInfoCoreService.getUserEmail();
    return email ? `ip=${ip} user=${email}` : `ip=${ip}`;
  }

  private formatRequestBody(request: any, logCustom?: LogCustomOptions): string {
    if (logCustom?.excluirRequest) {
      return OMITIDO;
    }

    const wrapper = { body: request?.body ?? {} };
    const semRemovidos = removeFields(wrapper, logCustom?.excluirCampoRequest);
    const semRedacted = redactFields(semRemovidos, logCustom?.mascararCampoRequest);

    return JSON.stringify(semRedacted.body).substring(0, 10000);
  }

  private formatResponse(response: any, logCustom?: LogCustomOptions): string {
    if (logCustom?.excluirResponse) {
      return OMITIDO;
    }

    const semRemovidos = removeFields(response ?? {}, logCustom?.excluirCampoResponse);
    const semRedacted = redactFields(semRemovidos, logCustom?.mascararCampoResponse);

    return JSON.stringify(semRedacted).substring(0, 10000);
  }

  private getIP(request: any): string {
    const ipAddr = request?.socket?.remoteAddress || request?.headers?.['x-forwarded-for'];
    if (!ipAddr) {
      return '';
    }

    const list = String(ipAddr).split(',');
    return list[list.length - 1].replace('::ffff:', '');
  }
}
