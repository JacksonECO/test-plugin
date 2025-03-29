import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';


@Injectable()
export class LogConsoleInterceptor implements NestInterceptor {
  private logger = new Logger('Request');

  constructor(
    private readonly requestInfoCoreService: RequestInfoCoreService
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const responseHttp = httpContext.getResponse();
    const routePath = request.path || request.config?.url || request.url;
    const routePathClean = routePath?.includes('?') ? routePath.substring(0, routePath.indexOf('?')) : routePath;
    const user = this.requestInfoCoreService.getUserEmail() || this.getIP(request);

    const formattedRequestBody = JSON.stringify(
      request.body ?? {},
    ).substring(0, 10000);

    this.logger.verbose(
      `${request.method} ${user}\n${routePath}\n${formattedRequestBody}`,
      `Start ${routePathClean}`,
    );

    return next.handle().pipe(
      tap((response) => {
        const bigResponse = JSON.stringify(
          response?.data ?? {},
        ).substring(0, 10000);

        this.logger.verbose(`${request.method}::${responseHttp?.statusCode ?? ''} ${user} ${Date.now() - now}ms\n${bigResponse}`,
          `End ${routePathClean}`,
        );
      }),
      catchError((error) => {
        this.logger.error(
          `Error::${error.status} ${routePathClean} ${user} ${Date.now() - now
          }ms\n${JSON.stringify(error.response || error.message).substring(0, 10000)}`, error.stack.toString(), ''
        );

        throw error;
      }),
    );
  }


  private getIP(request: any): string {
    let ip: string;
    const ipAddr =
      request.socket.remoteAddress || request.headers['x-forwarded-for'];
    if (ipAddr) {
      const list = ipAddr.split(',');
      ip = list[list.length - 1];
    } else {
      ip = request.socket.remoteAddress;
    }
    return ip.replace('::ffff:', '');
  }
}