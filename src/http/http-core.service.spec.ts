import { mockAuthorizationOption } from 'test/mocks/options.dto.mock';
import { HttpCoreService } from './http-core.service';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {
  mockRequestInfoCoreService,
  RequestInfoCoreServiceMock,
} from 'test/mocks/services/request-info-core.service.mock';
import { AuthServerServiceMock, mockAuthServerService } from 'test/mocks/services/auth-server.service.mock';
import { InternalServerErrorException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('HttpCoreService', () => {
  const urlBase = 'http://host.com';
  const options = mockAuthorizationOption();
  const requestInfoCoreService = mockRequestInfoCoreService();
  const authServerService = mockAuthServerService();
  const mockAxios: MockAdapter = new MockAdapter(axios);

  let service: HttpCoreService;

  afterEach(() => {
    jest.restoreAllMocks();
    mockAxios.reset();
  });

  describe('com token do serviço (próprio)', () => {
    beforeEach(() => {
      service = new HttpCoreService(options, authServerService, requestInfoCoreService, false);
    });

    it('deve estar definido', () => {
      expect(service).toBeDefined();
    });

    it('deve usar o token do serviço', async () => {
      const req = mockAxios.onGet(urlBase).reply(200, {});

      await service.get(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].headers).toHaveProperty('Authorization');
      expect(req.history[0].headers.Authorization).toBe(AuthServerServiceMock.tokenGerado);
    });

    it('deve usar o token da request caso seja forçado a utilização', async () => {
      const req = mockAxios.onGet(urlBase).reply(200, {});

      await service.token(true).get(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].headers).toHaveProperty('Authorization');
      expect(req.history[0].headers.Authorization).toBe(RequestInfoCoreServiceMock.tokenGerado);
    });

    it.each([
      { status: 200 },
      { status: 201 },
      { status: 400 },
      { status: 403 },
      { status: 404 },
      { status: 500 },
      { status: 502 },
      { status: 503 },
    ])('resposta com status $status não deve tentar obter um novo token', async ({ status }) => {
      const req = mockAxios.onGet(urlBase).reply(status, {});

      const getTokenForce = jest.spyOn(authServerService, 'getTokenForce');

      await service.get(urlBase).catch(() => {});

      expect(req.history).toHaveLength(1);
      expect(req.history[0].headers).toHaveProperty('Authorization');
      expect(req.history[0].headers).not.toHaveProperty('_retry');
      expect(getTokenForce).toHaveBeenCalledTimes(0);
    });

    it('resposta com status 401 deve tentar obter um novo token', async () => {
      const req = mockAxios.onGet(urlBase).reply(401, {});

      const getTokenForce = jest.spyOn(authServerService, 'getTokenForce');

      await service.get(urlBase).catch(() => {});

      expect(req.history).toHaveLength(2);
      expect(req.history[0].headers).toHaveProperty('Authorization');
      expect(req.history[0].headers).not.toHaveProperty('_retry');
      expect(getTokenForce).toHaveBeenCalledTimes(1);
    });

    it('tratar erro ao tentar obter um novo token', async () => {
      const req = mockAxios.onGet(urlBase).reply(401, {});

      const getTokenForce = jest.spyOn(authServerService, 'getTokenForce').mockImplementation(() => {
        throw new InternalServerErrorException('Erro ao obter token');
      });

      const result = await service.get(urlBase).catch(() => false);

      expect(result).toBe(false);
      expect(getTokenForce).toHaveBeenCalledTimes(1);
      expect(req.history).toHaveLength(1);

      // TODO: Validar com guardião
    });
  });

  describe('com token da request', () => {
    beforeEach(() => {
      service = new HttpCoreService(options, authServerService, requestInfoCoreService, true);
    });

    it('deve estar definido', () => {
      expect(service).toBeDefined();
    });

    it('deve usar o token que veio na request', async () => {
      const req = mockAxios.onGet(urlBase).reply(200, {});

      await service.get(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].headers).toHaveProperty('Authorization');
      expect(req.history[0].headers.Authorization).toBe(RequestInfoCoreServiceMock.tokenGerado);
    });

    it('deve usar o token do serviço caso não tenha token na request', async () => {
      const req = mockAxios.onGet(urlBase).reply(200, {});

      const requestOrigem = jest.spyOn(requestInfoCoreService, 'getAuthorization').mockReturnValue(undefined);

      await service.get(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].headers).toHaveProperty('Authorization');
      expect(req.history[0].headers.Authorization).toBe(AuthServerServiceMock.tokenGerado);

      expect(requestOrigem).toHaveBeenCalled();
    });

    it('deve usar o token do serviço seja forçado a utilização', async () => {
      const req = mockAxios.onGet(urlBase).reply(200, {});

      await service.token(false).get(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].headers).toHaveProperty('Authorization');
      expect(req.history[0].headers.Authorization).toBe(AuthServerServiceMock.tokenGerado);
    });

    it.each([
      { status: 200 },
      { status: 201 },
      { status: 400 },
      { status: 401 },
      { status: 403 },
      { status: 404 },
      { status: 500 },
      { status: 502 },
      { status: 503 },
    ])('resposta com status $status não deve tentar obter um novo token', async ({ status }) => {
      const req = mockAxios.onGet(urlBase).reply(status, {});

      const getTokenForce = jest.spyOn(authServerService, 'getTokenForce');

      await service.get(urlBase).catch(() => {});

      expect(req.history).toHaveLength(1);
      expect(req.history[0].headers).toHaveProperty('Authorization');
      expect(req.history[0].headers).not.toHaveProperty('_retry');
      expect(getTokenForce).toHaveBeenCalledTimes(0);
    });
  });

  describe('realizando requests corretamente do tipo:', () => {
    beforeEach(() => {
      service = new HttpCoreService(options, authServerService, requestInfoCoreService, faker.datatype.boolean());
    });

    it('get', async () => {
      const req = mockAxios.onGet(urlBase).reply(200, {});

      await service.get(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('get');
    });

    it('getUri', () => {
      const config = { url: urlBase };
      const uri = service.getUri(config);

      expect(uri).toBe(urlBase);
    });

    it('request', async () => {
      const req = mockAxios.onAny(urlBase).reply(200, {});

      await service.request({ url: urlBase, method: 'get' });

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('get');
    });

    it('delete', async () => {
      const req = mockAxios.onDelete(urlBase).reply(200, {});

      await service.delete(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('delete');
    });

    it('head', async () => {
      const req = mockAxios.onHead(urlBase).reply(200, {});

      await service.head(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('head');
    });

    it('options', async () => {
      const req = mockAxios.onOptions(urlBase).reply(200, {});

      await service.options(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('options');
    });

    it('post', async () => {
      const req = mockAxios.onPost(urlBase).reply(200, {});

      await service.post(urlBase, { key: 'value' });

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('post');
    });

    it('put', async () => {
      const req = mockAxios.onPut(urlBase).reply(200, {});

      await service.put(urlBase, { key: 'value' });

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('put');
    });

    it('patch', async () => {
      const req = mockAxios.onPatch(urlBase).reply(200, {});

      await service.patch(urlBase, { key: 'value' });

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('patch');
    });

    it('postForm', async () => {
      const req = mockAxios.onPost(urlBase).reply(200, {});

      await service.postForm(urlBase, { key: 'value' });

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('post');
    });

    it('putForm', async () => {
      const req = mockAxios.onPut(urlBase).reply(200, {});

      await service.putForm(urlBase, { key: 'value' });

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('put');
    });

    it('patchForm', async () => {
      const req = mockAxios.onPatch(urlBase).reply(200, {});

      await service.patchForm(urlBase, { key: 'value' });

      expect(req.history).toHaveLength(1);
      expect(req.history[0].method).toBe('patch');
    });
  });

  describe('para', () => {
    it('tipo de token pela config do plugin sendo token do serviço (próprio)', async () => {
      const optionsCustom = mockAuthorizationOption();
      optionsCustom.isTokenRequestDefault = false;
      service = new HttpCoreService(optionsCustom, authServerService, requestInfoCoreService, undefined);

      const req = mockAxios.onGet(urlBase).reply(200, {});

      await service.get(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].headers).toHaveProperty('Authorization');
      expect(req.history[0].headers.Authorization).toBe(AuthServerServiceMock.tokenGerado);
    });

    it('tipo de token pela config do plugin sendo token da request', async () => {
      const optionsCustom = mockAuthorizationOption();
      optionsCustom.isTokenRequestDefault = true;
      service = new HttpCoreService(optionsCustom, authServerService, requestInfoCoreService, undefined);

      const req = mockAxios.onGet(urlBase).reply(200, {});

      await service.get(urlBase);

      expect(req.history).toHaveLength(1);
      expect(req.history[0].headers).toHaveProperty('Authorization');
      expect(req.history[0].headers.Authorization).toBe(RequestInfoCoreServiceMock.tokenGerado);
    });
  });
});
