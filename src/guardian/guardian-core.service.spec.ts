import { mockGuardianOptions } from 'test/mocks/options.dto.mock';
import { GuardianCoreService } from './guardian-core.service';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

describe('GuardianCoreService', () => {
  const urlFuncional =
    'https://globalfinanceiro.webhook.office.com/webhookb2/e88d7ca2-d06e-4cfb-a82c-b79b301dfd82@d87e44fc-ee3f-4b78-a936-330c766f6293/IncomingWebhook/56317a613bc34923bd8700e433d1bfbe/106f03f0-6094-4e81-b250-28cab7ad5644/V24AcLbjd-nCJ7jWJJj16W21qEHZBXX2QGzTCYErxAenk1';

  let service: GuardianCoreService;
  let mockAxios: MockAdapter;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios, {
      onNoMatch: 'passthrough', // Permite que as requisições não correspondentes sejam passadas
    });
  });

  beforeEach(() => {
    service = new GuardianCoreService(mockGuardianOptions());
    mockAxios.onPost(mockGuardianOptions().url).reply(200, { status: 'success' });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe.skip('deve enviar para o teams (sem mock)', () => {
    beforeEach(() => {
      service = new GuardianCoreService(mockGuardianOptions({ url: urlFuncional }));
    });
    it('send', () => {
      return service.send({
        title: 'Test Title',
        agencia: '1234',
        info: {
          tipo: 'Test Type',
          valor: 1000,
          data: new Date(),
        },
        textDetail: 'Screening details',
        detalhes: {
          tipo: 'Test Type',
          valor: 1000,
          data: new Date(),
        },
      });
    });
  });

  describe('salvaRequest', () => {
    it('sucesso', async () => {
      await service.salvaRequest({
        url: 'https://example.com',
        title: 'Test Title',
        message: 'Test message',
        body: {
          data: new Date(),
          valor: 1000,
        },
      });

      expect(mockAxios.history).toHaveLength(1);
    });
    it('sucesso com body undefined', async () => {
      await service.salvaRequest({
        url: 'https://example.com',
        title: 'Test Title',
        message: 'Test message',
        body: undefined,
      });

      expect(mockAxios.history).toHaveLength(1);
    });
  });

  describe('enviarErro', () => {
    it('sucesso', async () => {
      await service.enviarErro({
        mensagem: 'Test message',
        agencia: '1234',
        body: {
          data: new Date(),
          valor: 1000,
        },
      });

      expect(mockAxios.history).toHaveLength(1);
    });
    it('sucesso sem info de agência', async () => {
      await service.enviarErro({
        mensagem: 'Test message',
        body: {
          data: new Date(),
          valor: 1000,
        },
      });

      expect(mockAxios.history).toHaveLength(1);
    });
  });
  describe('send', () => {
    it('sucesso com detalhes e info diversificado', async () => {
      await service.send({
        agencia: 'Agência 1234',
        title: 'Test Title',
        info: {
          numero: 123,
          obj: { chave: 'valor' },
          data: new Date(),
          va: undefined,
        },
        detalhes: {
          numero: 123,
          obj: { chave: 'valor' },
          data: new Date(),
          va: undefined,
        },
      });

      expect(mockAxios.history).toHaveLength(1);
    });

    it('sucesso com erro', async () => {
      await service.send({
        agencia: 'Agência 1234',
        title: 'Test Title',
        error: new Error('Test Error'),
      });

      expect(mockAxios.history).toHaveLength(1);
    });

    it('erros ao enviar request', async () => {
      mockAxios.onPost(mockGuardianOptions().url).reply(500, { status: 'error' });

      await service.send({
        title: 'Test Title',
      });

      expect(mockAxios.history).toHaveLength(1);
    });
  });
});
