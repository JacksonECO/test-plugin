import { HttpCoreService } from './http-core.service';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { AuthServerServiceMock, mockAuthServerService } from 'test/mocks/services/auth-server.service.mock';
import { InternalServerErrorException } from '@nestjs/common';

describe('HttpCoreService', () => {
  const urlBase = 'http://host.com';
  const authServerService = mockAuthServerService();
  const mockAxios: MockAdapter = new MockAdapter(axios);

  let service: HttpCoreService;

  beforeEach(() => {
    service = new HttpCoreService(authServerService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockAxios.reset();
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

  describe('realizando requests corretamente do tipo:', () => {
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
});
