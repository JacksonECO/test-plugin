import { Logger } from '@nestjs/common';
import { LogCoreRepository } from './log-core.repository';
import { LogSistemaCreateModel, LogSistemaRequestModel } from './log-core.model';
import { ContextCoreService } from 'src/context/context-core.module';
import { LogOptions } from 'src/options.dto';
export declare const CONTEXT_CORRELATION_ID = "correlationId";
export declare class LogCoreService {
    protected repository: LogCoreRepository;
    protected contextService: ContextCoreService;
    protected option?: LogOptions;
    protected logger: Logger;
    constructor(repository: LogCoreRepository, contextService: ContextCoreService, option?: LogOptions);
    salvarLog(dto: LogSistemaCreateModel): Promise<void>;
    salvarRequest(dto: LogSistemaRequestModel): Promise<void>;
    private camposOpcionais;
    private cleanRequest;
}
