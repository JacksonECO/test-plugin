import { InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockAuthorizationOption } from 'test/mocks/options.dto.mock';
import { mockCacheManager } from 'test/mocks/services/cacheManeger.service.mock';
import { Cache } from 'cache-manager';
import { AuthServerKeycloakService } from './auth-server-keycloak.service';

describe('AuthServerKeycloakService', () => {
  const options = mockAuthorizationOption();
  const urlIntrospect = `${options.authServerUrl}/realms/${options.client.realm}/protocol/openid-connect/token/introspect`;
  const urlAuth = `${options.authServerUrl}/realms/${options.client.realm}/protocol/openid-connect/token`;
  let service: AuthServerKeycloakService;
  let mockAxios: MockAdapter;
  let cache: Cache;

  beforeEach(() => {
    cache = mockCacheManager();

    service = new AuthServerKeycloakService(options, cache);

    mockAxios = new MockAdapter(axios);
  });

  afterEach(async () => {
    mockAxios.restore();
    await cache.clear();
  });

  describe('validateToken', () => {
    it('Deve retornar true e os dados de acesso quando o token for válido', async () => {
      const mockResponse = {
        active: true,
        realm_access: { roles: ['role1'] },
        resource_access: { resource1: { roles: ['role2'] } },
      };
      mockAxios.onPost(urlIntrospect).reply(200, mockResponse);

      const [isActive, accessData] = await service.validateToken('mock-jwt');

      expect(isActive).toBe(true);
      expect(accessData).toEqual({
        realm_access: mockResponse.realm_access,
        resource_access: mockResponse.resource_access,
      });
    });

    it('Deve retornar false e um objeto vazio quando o token for inválido com ative igual a false', async () => {
      mockAxios.onPost(urlIntrospect).reply(200, { active: false });

      const [isActive, accessData] = await service.validateToken('invalid-jwt');

      expect(isActive).toBe(false);
      expect(accessData).toEqual({});
    });

    it.each([
      { typeErro: () => mockAxios.onPost(urlIntrospect).passThrough(), message: 'Pass Through' },
      { typeErro: () => mockAxios.onPost(urlIntrospect).abortRequest(), message: 'Abort Request' },
      { typeErro: () => mockAxios.onPost(urlIntrospect).timeout(), message: 'Timeout' },
      { typeErro: () => mockAxios.onPost(urlIntrospect).networkError(), message: 'Network Error' },
      { typeErro: () => mockAxios.onPost(urlIntrospect).reply(401), message: 'HTTP 401' },
      { typeErro: () => mockAxios.onPost(urlIntrospect).reply(400), message: 'HTTP 400' },
      { typeErro: () => mockAxios.onPost(urlIntrospect).reply(500), message: 'HTTP 500' },
      {
        typeErro: () =>
          mockAxios.onPost(urlIntrospect).reply(() => {
            throw 'error';
          }),
        message: 'Error',
      },
    ])('Deve retornar false e um objeto vazio quando o token for inválido - $message', async ({ typeErro }) => {
      typeErro();

      const [isActive, accessData] = await service.validateToken('invalid-jwt');

      expect(isActive).toBe(false);
      expect(accessData).toEqual({});
    });
  });

  describe('getTokenForce', () => {
    it('Deve retornar o token de autenticação com sucesso', async () => {
      const mockResponse = {
        token_type: 'Bearer',
        access_token: 'mock-access-token',
        expires_in: 3600,
      };
      mockAxios.onPost(urlAuth).reply(200, mockResponse);

      const setToken = jest.spyOn(cache, 'set');

      const token = await service.getTokenForce();
      expect(token).toBe('Bearer mock-access-token');

      expect(setToken).toHaveBeenCalledTimes(1);
      expect(setToken.mock.calls[0][0]).toBe(AuthServerKeycloakService.keyAuthCache);
      expect(setToken.mock.calls[0][1]).toBe(token);
      expect(setToken.mock.calls[0][2]).toBe(3600000 - 60000);
    });

    it.each([
      { typeErro: () => mockAxios.onPost(urlAuth).passThrough(), message: 'Pass Through' },
      { typeErro: () => mockAxios.onPost(urlAuth).abortRequest(), message: 'Abort Request' },
      { typeErro: () => mockAxios.onPost(urlAuth).timeout(), message: 'Timeout' },
      { typeErro: () => mockAxios.onPost(urlAuth).networkError(), message: 'Network Error' },
      { typeErro: () => mockAxios.onPost(urlAuth).reply(401), message: 'HTTP 401' },
      { typeErro: () => mockAxios.onPost(urlAuth).reply(400), message: 'HTTP 400' },
      { typeErro: () => mockAxios.onPost(urlAuth).reply(500), message: 'HTTP 500' },
      {
        typeErro: () =>
          mockAxios.onPost(urlAuth).reply(() => {
            throw 'error';
          }),
        message: 'Error',
      },
    ])('Deve retornar um erro interno para qualquer erro na request - $message', async ({ typeErro }) => {
      typeErro();

      await expect(service.getTokenForce()).rejects.toThrow(
        new InternalServerErrorException('Tente novamente mais tarde'),
      );
    });
  });

  describe('getToken', () => {
    it('Deve bater no getTokenForce quando não estiver no cache', async () => {
      const mockResponse = {
        token_type: 'Bearer',
        access_token: 'mock-access-token',
        expires_in: 3600,
      };
      mockAxios.onPost(urlAuth).reply(200, mockResponse);
      const getToken = jest.spyOn(cache, 'get');
      const newToken = jest.spyOn(service, 'getTokenForce');

      const result = await service.getToken();

      expect(getToken).toHaveBeenCalledWith(AuthServerKeycloakService.keyAuthCache);
      expect(newToken).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse.token_type + ' ' + mockResponse.access_token);
    });

    it('Deve retornar o token do cache quando existir', async () => {
      const token = 'mock-token';
      const getToken = jest.spyOn(cache, 'get');
      const newToken = jest.spyOn(service, 'getTokenForce');

      await cache.set(AuthServerKeycloakService.keyAuthCache, token);

      const result = await service.getToken();

      expect(getToken).toHaveBeenCalledWith(AuthServerKeycloakService.keyAuthCache);
      expect(newToken).not.toHaveBeenCalled();
      expect(result).toBe(token);
    });
  });
});
