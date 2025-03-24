import { Injectable, Logger } from "@nestjs/common";
import { LogCoreRepository } from "./log-core.repository";
import { RequestInfoCoreService } from "src/request-info/request-info-core.service";
import { LogSistemaCreateModel, LogSistemaRequestModel } from "./log-core.model";

@Injectable()
export class LogCoreService {
  protected logger = new Logger(LogCoreService.name + 'Plugin');
  constructor(
    protected repository: LogCoreRepository,
    protected requestInfo: RequestInfoCoreService,
  ) { }

  async salvarLog(dto: LogSistemaCreateModel) {
    try {

      if (dto.response?.['request'] || dto.response?.['name'] == 'HttpException') {
        dto.response = {
          ...(dto.response['data'] || {}),
          ...(dto.response['body'] || {}),
          name: dto.response['name'],
          message: dto.response['message'],
          statusCode: dto.response['status'],
          stack: dto.response['stack'],
        };
      }

      if (dto.request?.['request'] || dto.request?.['name'] == 'HttpException') {
        dto.request = {
          ...(dto.request['data'] || {}),
          ...(dto.request['body'] || {}),
          name: dto.request['name'],
          message: dto.request['message'],
          statusCode: dto.request['status'],
          stack: dto.request['stack'],
        };
      }

      await this.repository.save({
        ...dto,
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
        dataOcorrencia: new Date(),
        user: this.requestInfo.getUserEmail(),
        tipo: 'request',
        message: dto.method + ': ' + dto.url,
      });
    } catch (error) {
      this.logger.error('Erro ao salvar uma requisição ' + dto.url, error);
    }
  }
}