import { Injectable, Logger } from '@nestjs/common';
import { LogCoreRepository } from './log-core.repository';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
import { LogSistemaCreateModel, LogSistemaRequestModel } from './log-core.model';

@Injectable()
export class LogCoreService {
  protected logger = new Logger(LogCoreService.name + 'Plugin');
  constructor(
    protected repository: LogCoreRepository,
    protected requestInfo: RequestInfoCoreService,
  ) {}

  async salvarLog(dto: LogSistemaCreateModel) {
    try {
      await this.repository.save({
        ...dto,
        request: this.cleanRequest(dto.request),
        response: this.cleanRequest(dto.response),
        dataOcorrencia: new Date(),
        user: this.requestInfo.getUserEmail(),
      });
    } catch (error) {
      this.logger.error('Erro ao salvar um log', error);
    }
  }

  async salvarRequest(dto: LogSistemaRequestModel) {
    try {
      if (dto.url?.includes('?')) {
        dto.url = dto.url.substring(0, dto.url.indexOf('?'));
      }

      await this.repository.save({
        ...dto,
        request: this.cleanRequest(dto.request),
        response: this.cleanRequest(dto.response),
        dataOcorrencia: new Date(),
        user: this.requestInfo.getUserEmail(),
        tipo: 'request',
        message: dto.method + ': ' + dto.url,
        info: this.requestInfo.getInfo(),
      });
    } catch (error) {
      this.logger.error('Erro ao salvar uma requisição ' + dto.url, error);
    }
  }

  private cleanRequest(request: any) {
    if (request?.['request'] || request?.['name'] == 'HttpException') {
      return {
        ...(request['data'] || {}),
        ...(request['body'] || {}),
        name: request['name'],
        message: request['message'],
        statusCode: request['status'],
        stack: request['stack'],
      };
    }
    return request;
  }
}
