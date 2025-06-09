import { Logger } from '@nestjs/common';
import { LogCoreRepository } from './log-core.repository';
import { LogSistemaCreateModel, LogSistemaRequestModel } from './log-core.model';
import { ContextCoreService } from 'src/context/context-core.module';
export declare class LogCoreService {
  protected repository: LogCoreRepository;
  protected contextService: ContextCoreService;
  protected logger: Logger;
  constructor(repository: LogCoreRepository, contextService: ContextCoreService);
  salvarLog(dto: LogSistemaCreateModel): Promise<void>;
  salvarRequest(dto: LogSistemaRequestModel): Promise<void>;
  private cleanRequest;
}
