import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { LogCoreService } from 'src/log/log-core.service';

@Injectable()
@Catch(ForbiddenException)
export class HttpForbiddenFilter implements ExceptionFilter {
  constructor(private logService: LogCoreService) {}

  catch(_: HttpException, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse();
    const request = httpContext.getRequest();

    const requestFormat = {
      body: request?.body,
      params: request?.params,
      query: request?.query,
    };

    const responseHttp = {
      message: 'Forbidden resource',
      error: 'Forbidden',
      statusCode: 403,
    };

    this.logService.salvarRequest({
      url: request.path || request.config?.url || request.url,
      method: request.method,
      statusCode: 403,
      request: requestFormat,
    });

    // // Resposta padrão no nest
    if (response.json && typeof response.json === 'function') {
      // Express
      response.status(403).json(responseHttp);
    } else if (response.send && typeof response.send === 'function') {
      // Fastify
      response.status(403).send(responseHttp);
    } else {
      throw new ForbiddenException();
    }
  }
}
