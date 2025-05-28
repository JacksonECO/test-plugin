import { LogSistemaCoreEntity } from './log-sistema.entity';
import { Model } from 'mongoose';
export declare class LogCoreRepository {
    private logSistema;
    constructor(logSistema: Model<LogSistemaCoreEntity>);
    save(dto: LogSistemaCoreEntity): Promise<void>;
}
