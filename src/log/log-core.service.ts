import { Injectable, Logger } from '@nestjs/common';
import { LogCoreRepository } from './log-core.repository';
import { LogSistemaCreateModel, LogSistemaRequestModel } from './log-core.model';
import { ContextCoreService } from 'src/context/context-core.module';

@Injectable()
export class LogCoreService {
  protected logger = new Logger(LogCoreService.name + 'Plugin');
  constructor(
    protected repository: LogCoreRepository,
    protected contextService: ContextCoreService,
  ) {}

  async salvarLog(dto: LogSistemaCreateModel) {
    try {
      await this.repository.save({
        ...dto,
        request: this.cleanRequest(dto.request),
        response: this.cleanRequest(dto.response),
        dataOcorrencia: new Date(),
        user: this.contextService.getUserEmail(),
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
        user: this.contextService.getUserEmail(),
        tipo: 'request',
        message: dto.method + ': ' + dto.url,
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
