import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LogCoreRepository } from './log-core.repository';
import { LogSistemaCoreEntity } from './log-sistema.entity';
import { HttpCoreService } from 'src/http/http-core.service';
import { mockAuthorizationOption } from 'test/mocks/options.dto.mock';
import { AuthServerKeycloakService } from 'src/auth-server/auth-server-keycloak.service';
import { mockCacheManager } from 'test/mocks/services/cacheManeger.service.mock';

class MockLogSistemaModel {
  save(): Promise<void> {
    return Promise.resolve();
  }
}

describe('LogCoreRepository', () => {
  let repository: LogCoreRepository;
  let model: typeof MockLogSistemaModel;
  let module: TestingModule;

  const urlBase = 'http://host.com';
  const options = mockAuthorizationOption();
  const urlAuth = `${options.authServerUrl}/realms/${options.client.realm}/protocol/openid-connect/token`;
  const mockAxios = new MockAdapter(axios);
  const cache = mockCacheManager();
  const authServer = new AuthServerKeycloakService(options, cache);
  const httpRequest = new HttpCoreService(authServer);

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        LogCoreRepository,
        {
          provide: getModelToken(LogSistemaCoreEntity.name),
          useValue: MockLogSistemaModel,
        },
      ],
    }).compile();

    repository = module.get<LogCoreRepository>(LogCoreRepository);
    model = module.get(getModelToken(LogSistemaCoreEntity.name));
  });

  beforeEach(() => {
    const mockResponse = {
      token_type: 'Bearer',
      access_token: 'mock-access-token',
      expires_in: 3600,
    };
    mockAxios.onPost(urlAuth).reply(200, mockResponse);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    mockAxios.reset();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a log entity with success', async () => {
      const dto: LogSistemaCoreEntity = {
        dataOcorrencia: new Date(),
        message: 'Test message',
        request: {},
        response: {},
        statusCode: 200,
        tipo: 'test',
        user: 'test@example.com',
      };

      const saveMock = jest.spyOn(model.prototype, 'save');
      mockAxios.onGet(urlBase).reply(200, mockAuthorizationOption());

      try {
        dto.response = await httpRequest.get(urlBase);
      } catch (error) {
        expect(0).toBe(1);
        dto.response = error;
      }

      // mockAxios.onPost(urlBase).reply(200, dto);

      try {
        dto.response = await httpRequest.post(urlBase);
        expect(0).toBe(1);
      } catch (error) {
        dto.response = error;
      }

      await repository.save(dto);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  it('should save a log entity with error', async () => {
    const dto: LogSistemaCoreEntity = {
      dataOcorrencia: new Date(),
      message: 'Test message',
      request: {},
      response: {},
      statusCode: 200,
      tipo: 'test',
      user: 'test@example.com',
    };

    const saveMock = jest.spyOn(model.prototype, 'save');

    try {
      dto.response = await httpRequest.get(urlBase);
      expect(0).toBe(1);
    } catch (error) {
      dto.response = error;
    }

    await repository.save(dto);
    expect(saveMock).toHaveBeenCalled();
  });
});
