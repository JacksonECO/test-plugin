import { LogSistemaCoreEntity } from './log-sistema.entity';
import { Model } from 'mongoose';
export declare class LogCoreRepository {
  protected logSistema: Model<LogSistemaCoreEntity>;
  constructor(logSistema: Model<LogSistemaCoreEntity>);
  save(dto: LogSistemaCoreEntity): Promise<void>;
}
