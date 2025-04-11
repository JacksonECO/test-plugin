import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogSistemaEntity } from './log-sistema.entity';
import { Model } from 'mongoose';

@Injectable()
export class LogCoreRepository {
  constructor(
    @InjectModel(LogSistemaEntity.name)
    private logSistema: Model<LogSistemaEntity>,
  ) {}

  async save(dto: LogSistemaEntity) {
    const requisicao = new this.logSistema(dto);
    await requisicao.save();
  }
}
