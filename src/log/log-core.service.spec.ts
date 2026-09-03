import { CONTEXT_CORRELATION_ID, LogCoreService } from './log-core.service';
import { LogCoreRepository } from './log-core.repository';
import { ContextCoreService } from 'src/context/context-core.service';
import { LogOptions } from 'src/options.dto';

describe('LogCoreService', () => {
  let service: LogCoreService;
  let repository: jest.Mocked<Pick<LogCoreRepository, 'save'>>;
  let contextService: ContextCoreService;

  function buildService(option?: LogOptions) {
    repository = { save: jest.fn() };
    contextService = new ContextCoreService();
    jest.spyOn(contextService, 'getUserEmail').mockReturnValue('user@x.com');

    service = new LogCoreService(repository as unknown as LogCoreRepository, contextService, option);
    return service;
  }

  beforeEach(() => {
    buildService();
  });

  function salvo() {
    return repository.save.mock.calls[0][0];
  }

  describe('systemName', () => {
    it('não grava systemName quando não configurado', async () => {
      await service.salvarLog({ message: 'x' });

      expect(salvo().systemName).toBeUndefined();
    });

    it('grava o systemName configurado em todos os logs', async () => {
      buildService(new LogOptions({ systemName: 'core-pix' }));

      await service.salvarLog({ message: 'x' });

      expect(salvo().systemName).toBe('core-pix');
    });

    it('o systemName do dto tem prioridade sobre o configurado', async () => {
      buildService(new LogOptions({ systemName: 'core-pix' }));

      await service.salvarLog({ message: 'x', systemName: 'outro' });

      expect(salvo().systemName).toBe('outro');
    });
  });

  describe('ip', () => {
    it('não captura o ip do contexto quando salvarIp está desligado', async () => {
      jest.spyOn(contextService, 'getIp').mockReturnValue('10.0.0.1');

      await service.salvarLog({ message: 'x' });

      expect(salvo().ip).toBeUndefined();
    });

    it('captura o ip do contexto quando salvarIp está ligado', async () => {
      buildService(new LogOptions({ salvarIp: true }));
      jest.spyOn(contextService, 'getIp').mockReturnValue('10.0.0.1');

      await service.salvarLog({ message: 'x' });

      expect(salvo().ip).toBe('10.0.0.1');
    });

    it('grava o ip informado no dto mesmo com salvarIp desligado', async () => {
      await service.salvarRequest({ url: '/x', method: 'GET', statusCode: 200, ip: '10.0.0.2' });

      expect(salvo().ip).toBe('10.0.0.2');
    });
  });

  describe('correlationId', () => {
    it('não captura o correlationId do contexto quando salvarCorrelationId está desligado', async () => {
      jest.spyOn(contextService, 'get').mockReturnValue('abc-123');

      await service.salvarLog({ message: 'x' });

      expect(salvo().correlationId).toBeUndefined();
    });

    it('captura o correlationId do contexto quando salvarCorrelationId está ligado', async () => {
      buildService(new LogOptions({ salvarCorrelationId: true }));
      const getSpy = jest.spyOn(contextService, 'get').mockReturnValue('abc-123');

      await service.salvarLog({ message: 'x' });

      expect(getSpy).toHaveBeenCalledWith(CONTEXT_CORRELATION_ID);
      expect(salvo().correlationId).toBe('abc-123');
    });

    it('grava o correlationId informado no dto mesmo com a captura desligada', async () => {
      await service.salvarRequest({ url: '/x', method: 'GET', statusCode: 200, correlationId: 'do-dto' });

      expect(salvo().correlationId).toBe('do-dto');
    });
  });

  it('mantém o comportamento padrão de salvarRequest (tipo, message e user)', async () => {
    await service.salvarRequest({ url: '/x?a=1', method: 'GET', statusCode: 200 });

    expect(salvo()).toEqual(
      expect.objectContaining({ tipo: 'request', message: 'GET: /x', user: 'user@x.com', url: '/x' }),
    );
  });
});
