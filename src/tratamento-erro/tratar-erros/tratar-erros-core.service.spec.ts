import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { TratarErrosCoreService } from './tratar-erros-core.service';

describe('TratarErrosCoreService', () => {
  let service: TratarErrosCoreService;

  beforeEach(() => {
    service = new TratarErrosCoreService();
  });

  it('relança o erroOriginal quando é uma HttpException', () => {
    const error = new HttpException('Boleto não encontrado', HttpStatus.NOT_FOUND);

    expect(() =>
      service.lancar({ mensagem: 'Boleto não encontrado', statusCode: 404, tipo: 'esperado', erroOriginal: error }),
    ).toThrow(error);
  });

  it('lança InternalServerErrorException com a mensagem identificada quando não é HttpException', () => {
    expect(() =>
      service.lancar({
        mensagem: 'falha de conexão',
        statusCode: 500,
        tipo: 'inesperado',
        erroOriginal: new Error('falha de conexão'),
      }),
    ).toThrow(new InternalServerErrorException('falha de conexão'));
  });
});
