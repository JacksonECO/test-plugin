import { LogSistemaEntity } from './log-sistema.entity';
import { Model } from 'mongoose';
export declare class LogCoreRepository {
  private logSistema;
  constructor(logSistema: Model<LogSistemaEntity>);
  save(dto: LogSistemaEntity): Promise<void>;
}
