import { Logger } from '@nestjs/common';
import { LogCoreRepository } from './log-core.repository';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
import { LogSistemaCreateModel, LogSistemaRequestModel } from './log-core.model';
export declare class LogCoreService {
    protected repository: LogCoreRepository;
    protected requestInfo: RequestInfoCoreService;
    protected logger: Logger;
    constructor(repository: LogCoreRepository, requestInfo: RequestInfoCoreService);
    salvarLog(dto: LogSistemaCreateModel): Promise<void>;
    salvarRequest(dto: LogSistemaRequestModel): Promise<void>;
    private cleanRequest;
}
