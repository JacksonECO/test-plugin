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
        mensagem: this.extrairMensagemAxios(error.response.data, error.message as string),
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

  /**
   * Tenta extrair uma mensagem legível do corpo de erro de uma API externa.
   * Cobre os formatos mais comuns entre os parceiros integrados (campo solto
   * "mensagem"/"message", convenção REST "error"/"erro", RFC 7807 "detail"/"title",
   * ou body de texto puro). Cai no `fallback` (a mensagem genérica do axios) quando
   * nenhum desses campos existe — formatos totalmente heterogêneos (ex: JD) continuam
   * exigindo tratamento próprio no consumidor.
   */
  private extrairMensagemAxios(data: any, fallback: string): string {
    if (data == null) {
      return fallback;
    }
    if (typeof data === 'string') {
      return data.trim() || fallback;
    }

    const candidato = data.mensagem ?? data.message ?? data.erro ?? data.error ?? data.detail ?? data.title;
    if (Array.isArray(candidato)) {
      return candidato.length ? candidato.join(', ') : fallback;
    }
    return candidato ?? fallback;
  }
}
