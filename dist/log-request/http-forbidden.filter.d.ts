import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { LogCoreService } from 'src/log/log-core.service';
export declare class HttpForbiddenFilter implements ExceptionFilter {
    private logService;
    constructor(logService: LogCoreService);
    catch(_: HttpException, host: ArgumentsHost): void;
}
