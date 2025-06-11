import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogSistemaCoreEntity } from './log-sistema.entity';
import { Model } from 'mongoose';

@Injectable()
export class LogCoreRepository {
  constructor(
    @InjectModel(LogSistemaCoreEntity.name)
    protected logSistema: Model<LogSistemaCoreEntity>,
  ) {}

  async save(dto: LogSistemaCoreEntity) {
    const requisicao = new this.logSistema(dto);
    await requisicao.save();
  }

  // TODO: Implementar o método find para buscar logs com filtros e paginação, e busca por id
  // TODO: Implementar um controller padrão e uma forma de exportar o controller de forma opcional e customizável
}
