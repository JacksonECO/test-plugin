import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
import { META_LOG_EXCLUDE, LogExcludeOptions } from 'src/log-request/decorator/log-exclude.decorator';
import { removeFields } from 'src/log-request/util/remove-fields';
import { redactFields } from 'src/log-request/util/redact-fields';

const OMITIDO = '"[omitido]"';

@Injectable()
export class LogConsoleInterceptor implements NestInterceptor {
  private logger = new Logger('Request');

  constructor(
    private readonly requestInfoCoreService: RequestInfoCoreService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const responseHttp = httpContext.getResponse();
    const routePath = request.path || request.config?.url || request.url;
    const routePathClean = routePath?.includes('?') ? routePath.substring(0, routePath.indexOf('?')) : routePath;
    const user = this.requestInfoCoreService.getUserEmail() || this.getIP(request);

    const logExclude = this.reflector.getAllAndOverride<LogExcludeOptions>(META_LOG_EXCLUDE, [
      context.getClass(),
      context.getHandler(),
    ]);

    const formattedRequestBody = this.formatRequestBody(request, logExclude);

    this.logger.verbose(`${request.method} ${user}\n${routePath}\n${formattedRequestBody}`, `Start ${routePathClean}`);

    return next.handle().pipe(
      tap((response) => {
        const bigResponse = this.formatResponse(response, logExclude);

        this.logger.verbose(
          `${request.method}::${responseHttp?.statusCode ?? ''} ${user} ${Date.now() - now}ms\n${bigResponse}`,
          `End ${routePathClean}`,
        );
      }),
      catchError((error) => {
        if (error.response) {
          error.response.request = undefined;
        }
        this.logger.error(
          `Error::${error.status} ${routePathClean} ${user} ${
            Date.now() - now
          }ms\n${this.formatResponse(error.response || error.message, logExclude)}`,
          error?.stack?.toString() ?? '',
          '',
        );

        throw error;
      }),
    );
  }

  private formatRequestBody(request: any, logExclude?: LogExcludeOptions): string {
    if (logExclude?.excludeRequest) {
      return OMITIDO;
    }

    const wrapper = { body: request?.body ?? {} };
    const semRemovidos = removeFields(wrapper, logExclude?.requestFields);
    const semRedacted = redactFields(semRemovidos, logExclude?.requestFieldsRedact);

    return JSON.stringify(semRedacted.body).substring(0, 10000);
  }

  private formatResponse(response: any, logExclude?: LogExcludeOptions): string {
    if (logExclude?.excludeResponse) {
      return OMITIDO;
    }

    const semRemovidos = removeFields(response ?? {}, logExclude?.responseFields);
    const semRedacted = redactFields(semRemovidos, logExclude?.responseFieldsRedact);

    return JSON.stringify(semRedacted).substring(0, 10000);
  }

  private getIP(request: any): string {
    let ip: string;
    const ipAddr = request.socket.remoteAddress || request.headers['x-forwarded-for'];
    if (ipAddr) {
      const list = ipAddr.split(',');
      ip = list[list.length - 1];
    } else {
      ip = request.socket.remoteAddress;
    }
    return ip.replace('::ffff:', '');
  }
}
