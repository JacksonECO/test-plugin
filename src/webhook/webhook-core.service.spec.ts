import { mockWebhookOptions } from 'test/mocks/options.dto.mock';
import { WebhookCoreService } from './webhook-core.service';
import { mockHttpCoreService } from 'test/mocks/services/http-core.service.mock';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  RequestWebhookCoreException,
  WebhookErrorException,
  WebhookNotFoundException,
  WebhookPartialErrorException,
} from './webhook-core.exception';
import { resumeErrorCore } from 'src/util/resume-erro-core';
import { mockGuardianCoreService } from 'test/mocks/services/webhook.service.mock';

describe('WebhookCoreService', () => {
  const url = mockWebhookOptions().url;
  let service: WebhookCoreService;
  const mockAxios: MockAdapter = new MockAdapter(axios);

  beforeEach(() => {
    service = new WebhookCoreService(mockWebhookOptions(), mockHttpCoreService(), mockGuardianCoreService());
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    mockAxios.reset();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getWebhookUrl', () => {
    it('deve buscar a url do webhook', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const mockResponse = {
        data: [{ url: 'http://example.com/webhook1' }, { url: 'http://example.com/webhook2' }],
      };

      mockAxios.onGet(`${url}/webhook/${agencia}/${event}`).reply(200, mockResponse);

      const result = await service.getWebhookUrl(event, agencia);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('url', 'http://example.com/webhook1');
      expect(result[1]).toHaveProperty('url', 'http://example.com/webhook2');
      result.forEach((item) => {
        expect(item).toHaveProperty('evento', event);
        expect(item).toHaveProperty('agencia', agencia);
      });
      expect(mockAxios.history.get).toHaveLength(1);
      expect(mockAxios.history).toHaveLength(1);
    });

    it('deve retornar um array vazio se o webhook não for encontrado', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';

      mockAxios.onGet(`${url}/webhook/${agencia}/${event}`).reply(404);
      const result = await service.getWebhookUrl(event, agencia);

      expect(result).toEqual([]);
    });

    it('deve lançar RequestWebhookCoreException em caso de erro', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';

      mockAxios.onGet(`${url}/webhook/${agencia}/${event}`).reply(500);

      await expect(service.getWebhookUrl(event, agencia)).rejects.toThrow(RequestWebhookCoreException);
    });
  });

  describe('send', () => {
    it('deve enviar dados para os webhooks', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';
      const mockWebhooks = {
        data: [{ url: 'http://example.com/webhook1' }, { url: 'http://example.com/webhook2' }],
      };
      const mockResponse1 = { success: true, dtoUrL: 'http://example.com/webhook1' };
      const mockResponse2 = { success: true, dtoUrL: 'http://example.com/webhook2' };

      mockAxios
        .onGet(`${url}/webhook/${agencia}/${event}`)
        .reply(200, mockWebhooks)
        .onPost('http://example.com/webhook1')
        .reply(200, mockResponse1)
        .onPost('http://example.com/webhook2')
        .reply(200, mockResponse2);

      const result = await service.send(event, agencia, body, methodHttp);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('webhook.url', 'http://example.com/webhook1');
      expect(result[0]).toHaveProperty('success', mockResponse1);
      expect(result[1]).toHaveProperty('webhook.url', 'http://example.com/webhook2');
      expect(result[1]).toHaveProperty('success', mockResponse2);

      expect(mockAxios.history.post).toHaveLength(2);
      expect(mockAxios.history.get).toHaveLength(1);
      expect(mockAxios.history.get[0].url).toBe(`${url}/webhook/${agencia}/${event}`);
      expect(mockAxios.history.post[0].url).toBe(mockWebhooks.data[0].url);
      expect(mockAxios.history.post[1].url).toBe(mockWebhooks.data[1].url);
      expect(mockAxios.history.post[0].data).toBe(JSON.stringify(body));
      expect(mockAxios.history.post[1].data).toBe(JSON.stringify(body));
    });

    it('deve lançar WebhookNotFoundException se não houver webhooks', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';

      mockAxios.onGet(`${url}/webhook/${agencia}/${event}`).reply(404);

      await expect(service.send(event, agencia, body, methodHttp)).rejects.toThrow(WebhookNotFoundException);
    });

    it('deve retornar uma lista vazia caso não encontre nenhum webhook via configuração (emptyException)', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';

      mockAxios.onGet(`${url}/webhook/${agencia}/${event}`).reply(404);

      const resp = await service.send(event, agencia, body, methodHttp, { emptyException: false });
      expect(resp).toEqual([]);
      expect(mockAxios.history.get).toHaveLength(1);
      expect(mockAxios.history.post).toHaveLength(1);
    });

    it('deve retornar erros e sucesso se alguns webhooks falharem, mas sem lançar exception', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';
      const mockWebhooks = {
        data: [{ url: 'http://example.com/webhook1' }, { url: 'http://example.com/webhook2' }],
      };
      const mockError = { message: 'Erro ao enviar webhook' };
      const mockSuccess = { success: true };

      mockAxios
        .onGet(`${url}/webhook/${agencia}/${event}`)
        .reply(200, mockWebhooks)
        .onPost('http://example.com/webhook1')
        .reply(500, mockError)
        .onPost('http://example.com/webhook2')
        .reply(200, mockSuccess);

      const result = await service.send(event, agencia, body, methodHttp);

      expect(result).toHaveLength(2);
      expect(mockAxios.history.get).toHaveLength(1);
      expect(mockAxios.history.post).toHaveLength(3);

      expect(result[0]).toHaveProperty('success', mockSuccess);
      expect(result[0]).toHaveProperty('webhook', {
        url: 'http://example.com/webhook2',
        evento: event,
        agencia: agencia,
      });
      expect(result[1]).toHaveProperty('webhook', {
        url: 'http://example.com/webhook1',
        evento: event,
        agencia: agencia,
      });
      expect(result[1]).toHaveProperty('error', expect.objectContaining({}));
      expect(result[1]).toHaveProperty('erroObj', mockError);
      expect(result[1]).toHaveProperty('erroString', resumeErrorCore(mockError));
    });

    it('deve lançar WebhookErrorException em caso de erro ao enviar webhook', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';
      const mockWebhooks = {
        data: [{ url: 'http://example.com/webhook1' }],
      };

      mockAxios
        .onGet(`${url}/webhook/${agencia}/${event}`)
        .reply(200, mockWebhooks)
        .onPost('http://example.com/webhook1')
        .reply(500);

      await expect(service.send(event, agencia, body, methodHttp)).rejects.toThrow(WebhookErrorException);
    });

    it('deve lançar RequestWebhookCoreException em caso de não conseguir buscar os webhooks (no core)', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';

      mockAxios.onGet(`${url}/webhook/${agencia}/${event}`).reply(500, { message: 'Internal Server Error' });

      await expect(service.send(event, agencia, body, methodHttp)).rejects.toThrow(RequestWebhookCoreException);
    });

    it('deve lançar WebhookNotFoundException em caso erro 404 ao buscar webhooks', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';

      mockAxios.onGet(`${url}/webhook/${agencia}/${event}`).reply(404, { message: 'Nenhum webhook encontrado' });

      await expect(service.send(event, agencia, body, methodHttp)).rejects.toThrow(WebhookNotFoundException);
    });

    it('deve lançar WebhookNotFoundException em caso retorne 200 com uma lista vazia de webhooks', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';

      mockAxios.onGet(`${url}/webhook/${agencia}/${event}`).reply(200, { data: [] });

      await expect(service.send(event, agencia, body, methodHttp)).rejects.toThrow(WebhookNotFoundException);
    });

    it('deve lançar WebhookPartialErrorException caso configurado para dar erro em sucesso parcial (successAndErrorsException)', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';
      const mockWebhooks = {
        data: [{ url: 'http://example.com/webhook1' }, { url: 'http://example.com/webhook2' }],
      };
      const mockError = { message: 'Erro ao enviar webhook' };
      const mockSuccess = { success: true };

      mockAxios
        .onGet(`${url}/webhook/${agencia}/${event}`)
        .reply(200, mockWebhooks)
        .onPost('http://example.com/webhook1')
        .reply(500, mockError)
        .onPost('http://example.com/webhook2')
        .reply(200, mockSuccess);

      try {
        await service.send(event, agencia, body, methodHttp, { successAndErrorsException: true });
        expect(true).toBe(false); // Se chegar aqui, falhou o teste
      } catch (error) {
        expect(error).toBeInstanceOf(WebhookPartialErrorException);

        expect(error.error).toHaveLength(1);
        expect(error.error[0]).toHaveProperty('webhook', {
          url: 'http://example.com/webhook1',
          evento: event,
          agencia: agencia,
        });
        expect(error.error[0]).toHaveProperty('erroObj', mockError);
        expect(error.error[0]).toHaveProperty('erroString', resumeErrorCore(mockError));

        expect(error.success).toHaveLength(1);
        expect(error.success[0]).toHaveProperty('webhook', {
          url: 'http://example.com/webhook2',
          evento: event,
          agencia: agencia,
        });
        expect(error.success[0]).toHaveProperty('success', mockSuccess);
      }
    });

    it('deve lançar WebhookErrorException caso acontecer um erro não esperado', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';
      const mockWebhooks = {
        data: [{ url: 'http://example.com/webhook1' }],
      };
      const mockResponse1 = { success: true, dtoUrL: 'http://example.com/webhook1' };

      mockAxios
        .onGet(`${url}/webhook/${agencia}/${event}`)
        .reply(200, mockWebhooks)
        .onPost('http://example.com/webhook1')
        .reply(200, mockResponse1);

      service['http'] = undefined; // Forçar um erro especifico
      jest
        .spyOn(WebhookCoreService.prototype, 'getWebhookUrl')
        .mockReturnValue(
          Promise.resolve([{ url: 'http://example.com/webhook1', evento: event, agencia: agencia } as any]),
        );

      await expect(service.send(event, agencia, body, methodHttp)).rejects.toThrow(WebhookErrorException);
    });

    it('deve ergehfjhnthrthrt', async () => {
      const event = 'testEvent';
      const agencia = 'testAgencia';
      const body = { key: 'value' };
      const methodHttp = 'POST';
      const mockWebhooks = {
        data: [{ url: 'http://example.com/webhook1' }],
      };

      mockAxios
        .onGet(`${url}/webhook/${agencia}/${event}`)
        .reply(200, mockWebhooks)
        .onPost('http://example.com/webhook1')
        .reply(400, 'mockResponse1');

      await expect(service.send(event, agencia, body, methodHttp)).rejects.toThrow(WebhookErrorException);
    });
  });
});
