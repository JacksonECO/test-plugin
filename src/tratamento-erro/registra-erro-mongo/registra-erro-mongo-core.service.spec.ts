import type { Mocked } from 'vitest';
import { RegistraErroMongoCoreService } from './registra-erro-mongo-core.service';
import { TratamentoErroOptions } from '../../options.dto';
import { TratamentoErroLogRepository } from '../interfaces/tratamento-erro-log.repository';

describe('RegistraErroMongoCoreService', () => {
  let service: RegistraErroMongoCoreService;
  let logRepository: Mocked<TratamentoErroLogRepository>;

  beforeEach(() => {
    logRepository = { salvarRequisicao: vi.fn() };
    service = new RegistraErroMongoCoreService(logRepository, new TratamentoErroOptions());
  });

  describe('registrar', () => {
    it('serializa o erroOriginal como {name, message, stack} antes de persistir', async () => {
      const erroOriginal = new Error('falha ao consultar boleto');

      await service.registrar({
        mensagem: 'falha ao consultar boleto',
        statusCode: 500,
        tipo: 'inesperado',
        erroOriginal,
      });

      expect(logRepository.salvarRequisicao).toHaveBeenCalledWith({
        tipo: 'SYSTEM',
        statusCode: 500,
        message: 'falha ao consultar boleto',
        request: undefined,
        response: {
          name: 'Error',
          message: 'falha ao consultar boleto',
          stack: erroOriginal.stack,
        },
      });
    });

    it('inclui statusCode e data do response do axios quando o erroOriginal é AxiosError', async () => {
      const erroOriginal = {
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Request failed with status code 502',
        stack: 'stack trace',
        response: { status: 502, data: { jdCodigoErro: 'EDDA0076', descricao: 'Erro interno JD' } },
      };

      await service.registrar({
        mensagem: 'Request failed with status code 502',
        statusCode: 502,
        tipo: 'inesperado',
        erroOriginal,
      });

      expect(logRepository.salvarRequisicao).toHaveBeenCalledWith(
        expect.objectContaining({
          response: {
            name: 'AxiosError',
            message: 'Request failed with status code 502',
            stack: 'stack trace',
            statusCode: 502,
            data: { jdCodigoErro: 'EDDA0076', descricao: 'Erro interno JD' },
          },
        }),
      );
    });

    it('usa tipoLog e mensagem do contexto quando fornecidos', async () => {
      await service.registrar(
        { mensagem: 'mensagem original', statusCode: 400, tipo: 'esperado', erroOriginal: new Error('x') },
        { tipoLog: 'ARRECADACAO', mensagem: 'mensagem sobrescrita', request: { agencia: '1234' } },
      );

      expect(logRepository.salvarRequisicao).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo: 'ARRECADACAO',
          message: 'mensagem sobrescrita',
          request: { agencia: '1234' },
        }),
      );
    });
  });

  describe('registrarSempre', () => {
    it('persiste mensagem fixa com statusCode 500 por padrão', async () => {
      await service.registrarSempre('notificação manual');

      expect(logRepository.salvarRequisicao).toHaveBeenCalledWith({
        tipo: 'SYSTEM',
        statusCode: 500,
        message: 'notificação manual',
        request: undefined,
      });
    });

    it('respeita statusCode do contexto', async () => {
      await service.registrarSempre('aviso', { statusCode: 200 });

      expect(logRepository.salvarRequisicao).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 200 }));
    });
  });
});
