import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CORE_TRATAMENTO_ERRO_OPTION } from '../../constants';
import { TratamentoErroOptions } from '../../options.dto';
import { ErroIdentificado } from '../interfaces/erro-identificado.interface';

@Injectable()
export class IdentificaErroCoreService {
  constructor(
    @Inject(CORE_TRATAMENTO_ERRO_OPTION)
    private options: TratamentoErroOptions,
  ) {}

  identificar(error: any): ErroIdentificado {
    if (error instanceof HttpException) {
      const statusCode = error.getStatus();
      const response = error.getResponse();
      const mensagemBruta = typeof response === 'string' ? response : ((response as any)?.message ?? error.message);

      return {
        mensagem: Array.isArray(mensagemBruta) ? mensagemBruta.join(', ') : mensagemBruta,
        statusCode,
        tipo: statusCode < 500 ? 'esperado' : 'inesperado',
        erroOriginal: error,
      };
    }

    if (error?.isAxiosError && error.response) {
      const statusCode = error.response.status;
      return {
        mensagem: error.response.data?.mensagem || error.response.data?.message || error.message,
        statusCode,
        tipo: statusCode < 500 ? 'esperado' : 'inesperado',
        erroOriginal: error,
      };
    }

    return {
      mensagem: error?.message || this.options.mensagemPadrao,
      statusCode: 500,
      tipo: 'inesperado',
      erroOriginal: error,
    };
  }
}
