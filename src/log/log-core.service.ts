import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { LogCoreRepository } from './log-core.repository';
import { LogSistemaCreateModel, LogSistemaRequestModel } from './log-core.model';
import { ContextCoreService } from 'src/context/context-core.module';
import { CORE_LOG_OPTION } from 'src/constants';
import { LogOptions } from 'src/options.dto';

/** Chave usada no contexto da request para propagar o id de correlação até os logs manuais. */
export const CONTEXT_CORRELATION_ID = 'correlationId';

@Injectable()
export class LogCoreService {
  protected logger = new Logger(LogCoreService.name + 'Plugin');
  constructor(
    protected repository: LogCoreRepository,
    protected contextService: ContextCoreService,
    @Optional() @Inject(CORE_LOG_OPTION) protected option?: LogOptions,
  ) {}

  async salvarLog(dto: LogSistemaCreateModel) {
    try {
      await this.repository.save({
        ...dto,
        ...this.camposOpcionais(dto),
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
        ...this.camposOpcionais(dto),
        request: this.cleanRequest(dto.request),
        response: this.cleanRequest(dto.response),
        dataOcorrencia: new Date(),
        user: this.contextService.getUserEmail(),
        tipo: dto.tipo ?? 'request',
        message: dto.message ?? dto.method + ': ' + dto.url,
      });
    } catch (error) {
      this.logger.error('Erro ao salvar uma requisição ' + dto.url, error);
    }
  }

  /**
   * Campos que só são gravados quando configurados em `LogOptions`. Um valor informado
   * explicitamente no DTO sempre prevalece — a config controla só a captura automática.
   */
  private camposOpcionais(dto: LogSistemaCreateModel | LogSistemaRequestModel) {
    return {
      systemName: dto.systemName ?? this.option?.systemName,
      ip: dto.ip ?? (this.option?.salvarIp ? this.contextService.getIp() : undefined),
      correlationId:
        dto.correlationId ??
        (this.option?.salvarCorrelationId ? this.contextService.get(CONTEXT_CORRELATION_ID) : undefined),
    };
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
