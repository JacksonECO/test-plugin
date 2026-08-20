import { Inject, Injectable } from '@nestjs/common';
import { CORE_TRATAMENTO_ERRO_LOG_REPOSITORY, CORE_TRATAMENTO_ERRO_OPTION } from '../../constants';
import { TratamentoErroOptions } from '../../options.dto';
import { ContextoErro } from '../interfaces/contexto-erro.interface';
import { ErroIdentificado } from '../interfaces/erro-identificado.interface';
import { TratamentoErroLogRepository } from '../interfaces/tratamento-erro-log.repository';

@Injectable()
export class RegistraErroMongoCoreService {
  constructor(
    @Inject(CORE_TRATAMENTO_ERRO_LOG_REPOSITORY)
    private logRepository: TratamentoErroLogRepository,
    @Inject(CORE_TRATAMENTO_ERRO_OPTION)
    private options: TratamentoErroOptions,
  ) {}

  async registrar(erroIdentificado: ErroIdentificado, contexto?: ContextoErro): Promise<void> {
    const erroOriginal = erroIdentificado.erroOriginal as any;

    await this.logRepository.salvarRequisicao({
      tipo: contexto?.tipoLog ?? this.options.tipoLogPadrao,
      statusCode: contexto?.statusCode ?? erroIdentificado.statusCode,
      message: contexto?.mensagem ?? erroIdentificado.mensagem,
      request: contexto?.request,
      response: {
        name: erroOriginal?.name,
        message: erroOriginal?.message,
        stack: erroOriginal?.stack,
      },
    });
  }

  async registrarSempre(mensagem: string, contexto?: ContextoErro): Promise<void> {
    await this.logRepository.salvarRequisicao({
      tipo: contexto?.tipoLog ?? this.options.tipoLogPadrao,
      statusCode: contexto?.statusCode ?? 500,
      message: mensagem,
      request: contexto?.request,
    });
  }
}
