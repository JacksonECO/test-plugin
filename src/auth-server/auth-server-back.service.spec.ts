import { AuthServerBackService } from "./auth-server-back.service";
import { InternalServerErrorException } from "@nestjs/common";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mockAuthorizationOption } from "test/mocks/options.dto.mock";
import { mockCacheManager } from "test/mocks/services/cacheManeger.service.mock";
import { Cache } from "cache-manager";

describe("AuthServerBackService", () => {
  const options = mockAuthorizationOption();
  let service: AuthServerBackService;
  let mockAxios: MockAdapter;
  let cache: Cache;

  beforeEach(() => {
    cache = mockCacheManager();

    service = new AuthServerBackService(
      options,
      cache,
    );

    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
    cache.clear();
  });

  describe("validateToken", () => {
    it("Deve retornar true e os dados de acesso quando o token for válido", async () => {
      const mockResponse = {
        data: {
          active: true,
          realm_access: { roles: ["role1"] },
          resource_access: { resource1: { roles: ["role2"] } },
        },
      };
      mockAxios.onPost(options.authServerUrl + "/system-user/introspect").reply(200, mockResponse);

      const [isActive, accessData] = await service.validateToken("mock-jwt");

      expect(isActive).toBe(true);
      expect(accessData).toEqual({
        realm_access: mockResponse.data.realm_access,
        resource_access: mockResponse.data.resource_access,
      });
    });

    it("Deve retornar false e um objeto vazio quando o token for inválido com ative igual a false", async () => {
      mockAxios.onPost(options.authServerUrl + "/system-user/introspect").reply(200, { data: { active: false } });

      const [isActive, accessData] = await service.validateToken("invalid-jwt");

      expect(isActive).toBe(false);
      expect(accessData).toEqual({});
    });

    it("Deve retornar false e um objeto vazio quando o token for inválido com ative igual a false2", async () => {
      mockAxios.onPost(options.authServerUrl + "/system-user/introspect").reply(() => { throw 'error' });

      const [isActive, accessData] = await service.validateToken("invalid-jwt");

      expect(isActive).toBe(false);
      expect(accessData).toEqual({});
    });

    it.each([
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/introspect").passThrough(), message: "Pass Through" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/introspect").abortRequest(), message: "Abort Request" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/introspect").timeout(), message: "Timeout" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/introspect").networkError(), message: "Network Error" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/introspect").reply(401), message: "HTTP 401" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/introspect").reply(400), message: "HTTP 400" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/introspect").reply(500), message: "HTTP 500" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/introspect").reply(() => { throw 'error' }), message: "Error" },
    ])
      ("Deve retornar false e um objeto vazio quando o token for inválido - $message", async ({ typeErro }) => {
        typeErro();

        const [isActive, accessData] = await service.validateToken("invalid-jwt");

        expect(isActive).toBe(false);
        expect(accessData).toEqual({});
      });
  });

  describe("getTokenForce", () => {
    it("Deve retornar o token de autenticação com sucesso", async () => {
      const mockResponse = {
        data: {
          tokenType: "Bearer",
          accessToken: "mock-access-token",
          expiresIn: 3600,
        },
      };
      mockAxios.onPost(options.authServerUrl + "/system-user/auth").reply(200, mockResponse);

      const setToken = jest.spyOn(cache, 'set');

      const token = await service.getTokenForce();
      expect(token).toBe("Bearer mock-access-token");

      expect(setToken).toHaveBeenCalledTimes(1);
      expect(setToken.mock.calls[0][0]).toBe(AuthServerBackService.keyAuthCache);
      expect(setToken.mock.calls[0][1]).toBe(token);
      expect(setToken.mock.calls[0][2]).toBe(3600000 - 60000);
    });

    it.each([
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/auth").passThrough(), message: "Pass Through" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/auth").abortRequest(), message: "Abort Request" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/auth").timeout(), message: "Timeout" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/auth").networkError(), message: "Network Error" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/auth").reply(401), message: "HTTP 401" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/auth").reply(400), message: "HTTP 400" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/auth").reply(500), message: "HTTP 500" },
      { typeErro: () => mockAxios.onPost(options.authServerUrl + "/system-user/auth").reply(() => { throw 'error' }), message: "Error" },
    ])("Deve retornar um erro interno para qualquer erro na request - $message", async ({ typeErro }) => {
      typeErro();

      await expect(service.getTokenForce()).rejects.toThrow(new InternalServerErrorException('Tente novamente mais tarde'));
    });
  });

  describe("getToken", () => {
    it("Deve bater no getTokenForce quando não estiver no cache", async () => {
      const mockResponse = {
        data: {
          tokenType: "Bearer",
          accessToken: "mock-access-token",
          expiresIn: 3600,
        },
      };
      mockAxios.onPost(options.authServerUrl + "/system-user/auth").reply(200, mockResponse);
      const getToken = jest.spyOn(cache, "get");
      const newToken = jest.spyOn(service, "getTokenForce");

      const result = await service.getToken();

      expect(getToken).toHaveBeenCalledWith(AuthServerBackService.keyAuthCache);
      expect(newToken).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse.data.tokenType + ' ' + mockResponse.data.accessToken);
    });

    it("Deve retornar o token do cache quando existir", async () => {
      const token = "mock-token";
      const getToken = jest.spyOn(cache, "get");
      const newToken = jest.spyOn(service, "getTokenForce");

      await cache.set(AuthServerBackService.keyAuthCache, token);

      const result = await service.getToken();

      expect(getToken).toHaveBeenCalledWith(AuthServerBackService.keyAuthCache);
      expect(newToken).not.toHaveBeenCalled();
      expect(result).toBe(token);
    });
  });
});
