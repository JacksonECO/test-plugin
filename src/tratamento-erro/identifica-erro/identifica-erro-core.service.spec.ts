import { HttpException, HttpStatus } from '@nestjs/common';
import { IdentificaErroCoreService } from './identifica-erro-core.service';
import { TratamentoErroOptions } from '../../options.dto';

describe('IdentificaErroCoreService', () => {
  let service: IdentificaErroCoreService;

  beforeEach(() => {
    service = new IdentificaErroCoreService(new TratamentoErroOptions());
  });

  it('classifica HttpException com status < 500 como esperado', () => {
    const error = new HttpException('Boleto não encontrado', HttpStatus.NOT_FOUND);

    const resultado = service.identificar(error);

    expect(resultado).toEqual({
      mensagem: 'Boleto não encontrado',
      statusCode: 404,
      tipo: 'esperado',
      erroOriginal: error,
    });
  });

  it('classifica HttpException com status >= 500 como inesperado', () => {
    const error = new HttpException('Falha interna', HttpStatus.INTERNAL_SERVER_ERROR);

    const resultado = service.identificar(error);

    expect(resultado.tipo).toBe('inesperado');
    expect(resultado.statusCode).toBe(500);
  });

  it('concatena array de mensagens de HttpException (ex: ValidationPipe)', () => {
    const error = new HttpException(
      { message: ['campo A é obrigatório', 'campo B é inválido'] },
      HttpStatus.BAD_REQUEST,
    );

    const resultado = service.identificar(error);

    expect(resultado.mensagem).toBe('campo A é obrigatório, campo B é inválido');
    expect(resultado.tipo).toBe('esperado');
  });

  it('classifica AxiosError com response.status < 500 como esperado (erro de negócio do parceiro)', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed with status code 400',
      response: {
        status: 400,
        data: { mensagem: 'Arrecadação não encontrada' },
      },
    };

    const resultado = service.identificar(error);

    expect(resultado).toEqual({
      mensagem: 'Arrecadação não encontrada',
      statusCode: 400,
      tipo: 'esperado',
      erroOriginal: error,
    });
  });

  it('classifica AxiosError com response.status >= 500 como inesperado', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed with status code 502',
      response: { status: 502, data: {} },
    };

    const resultado = service.identificar(error);

    expect(resultado.tipo).toBe('inesperado');
    expect(resultado.statusCode).toBe(502);
  });

  it('usa error.message quando AxiosError não tem data.mensagem nem data.message', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed with status code 400',
      response: { status: 400, data: {} },
    };

    const resultado = service.identificar(error);

    expect(resultado.mensagem).toBe('Request failed with status code 400');
  });

  it('classifica AxiosError sem response (timeout/conexão) como inesperado com statusCode 500 via fallback genérico', () => {
    const error = {
      isAxiosError: true,
      message: 'timeout of 5000ms exceeded',
    };

    const resultado = service.identificar(error);

    expect(resultado).toEqual({
      mensagem: 'timeout of 5000ms exceeded',
      statusCode: 500,
      tipo: 'inesperado',
      erroOriginal: error,
    });
  });

  it('classifica erro cru (não HttpException, não Axios) como inesperado com statusCode 500', () => {
    const error = new Error('falha desconhecida');

    const resultado = service.identificar(error);

    expect(resultado).toEqual({
      mensagem: 'falha desconhecida',
      statusCode: 500,
      tipo: 'inesperado',
      erroOriginal: error,
    });
  });

  it('usa mensagemPadrao das options quando o erro não tem .message', () => {
    service = new IdentificaErroCoreService(
      new TratamentoErroOptions({ mensagemPadrao: 'Mensagem customizada' } as TratamentoErroOptions),
    );

    const resultado = service.identificar({});

    expect(resultado.mensagem).toBe('Mensagem customizada');
  });
});
