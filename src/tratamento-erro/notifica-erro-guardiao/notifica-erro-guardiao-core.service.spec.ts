import { NotificaErroGuardiaoCoreService } from './notifica-erro-guardiao-core.service';
import { GuardianCoreService } from '../../guardian/guardian-core.service';
import { TratamentoErroLogRepository } from '../interfaces/tratamento-erro-log.repository';

describe('NotificaErroGuardiaoCoreService', () => {
  let service: NotificaErroGuardiaoCoreService;
  let guardianCoreService: jest.Mocked<GuardianCoreService>;
  let logRepository: jest.Mocked<TratamentoErroLogRepository>;

  beforeEach(() => {
    guardianCoreService = { enviarErro: jest.fn() } as any;
    logRepository = { salvarRequisicao: jest.fn() };
    service = new NotificaErroGuardiaoCoreService(guardianCoreService, logRepository);
  });

  describe('notificarSeNecessario', () => {
    it('não notifica quando o erro é do tipo esperado', async () => {
      await service.notificarSeNecessario({
        mensagem: 'Boleto não encontrado',
        statusCode: 404,
        tipo: 'esperado',
        erroOriginal: new Error('x'),
      });

      expect(guardianCoreService.enviarErro).not.toHaveBeenCalled();
    });

    it('notifica o Guardião quando o erro é do tipo inesperado', async () => {
      const erroOriginal = new Error('falha de conexão');

      await service.notificarSeNecessario(
        { mensagem: 'falha de conexão', statusCode: 500, tipo: 'inesperado', erroOriginal },
        { agencia: '1234', request: { boleto: 'X' } },
      );

      expect(guardianCoreService.enviarErro).toHaveBeenCalledWith({
        falha: erroOriginal.stack,
        mensagem: 'falha de conexão',
        agencia: '1234',
        request: { boleto: 'X' },
        ip: undefined,
      });
    });

    it('usa contexto.falha para sobrescrever o stack quando fornecido', async () => {
      await service.notificarSeNecessario(
        { mensagem: 'm', statusCode: 500, tipo: 'inesperado', erroOriginal: new Error('x') },
        { falha: 'falha customizada' },
      );

      expect(guardianCoreService.enviarErro).toHaveBeenCalledWith(
        expect.objectContaining({ falha: 'falha customizada' }),
      );
    });

    it('nunca lança: registra a falha via log repository quando enviarErro rejeita', async () => {
      const falhaGuardiao = new Error('Teams indisponível');
      guardianCoreService.enviarErro.mockRejectedValueOnce(falhaGuardiao);

      await expect(
        service.notificarSeNecessario({
          mensagem: 'm',
          statusCode: 500,
          tipo: 'inesperado',
          erroOriginal: new Error('x'),
        }),
      ).resolves.toBeUndefined();

      expect(logRepository.salvarRequisicao).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo: 'SYSTEM',
          statusCode: 500,
          response: expect.objectContaining({ message: 'Teams indisponível' }),
        }),
      );
    });

    it('nunca lança mesmo com falha dupla: Guardian E salvarRequisicao ambos rejeitam', async () => {
      guardianCoreService.enviarErro.mockRejectedValueOnce(new Error('Teams indisponível'));
      logRepository.salvarRequisicao.mockRejectedValueOnce(new Error('MongoDB indisponível'));

      await expect(
        service.notificarSeNecessario({
          mensagem: 'm',
          statusCode: 500,
          tipo: 'inesperado',
          erroOriginal: new Error('x'),
        }),
      ).resolves.toBeUndefined();

      expect(logRepository.salvarRequisicao).toHaveBeenCalled();
    });
  });

  describe('notificarSempre', () => {
    it('envia sem erroOriginal', async () => {
      await service.notificarSempre('aviso manual', { agencia: 'ag1' });

      expect(guardianCoreService.enviarErro).toHaveBeenCalledWith({
        falha: 'aviso manual',
        mensagem: 'aviso manual',
        agencia: 'ag1',
        request: {},
        ip: undefined,
      });
    });

    it('nunca lança mesmo se enviarErro rejeitar', async () => {
      guardianCoreService.enviarErro.mockRejectedValueOnce(new Error('falhou'));

      await expect(service.notificarSempre('aviso')).resolves.toBeUndefined();
      expect(logRepository.salvarRequisicao).toHaveBeenCalled();
    });
  });
});
