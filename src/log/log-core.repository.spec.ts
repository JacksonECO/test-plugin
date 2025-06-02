import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { LogCoreRepository } from './log-core.repository';
import { LogSistemaCoreEntity } from './log-sistema.entity';
import { Model } from 'mongoose';
import { HttpCoreService } from 'src/http/http-core.service';
import { mockAuthorizationOption } from 'test/mocks/options.dto.mock';
import { mockRequestInfoCoreService } from 'test/mocks/services/request-info-core.service.mock';
import { CORE_LOG_OPTION } from 'src/constants';
import { LogOptions } from 'src/options.dto';
import { AuthServerKeycloakService } from 'src/auth-server/auth-server-keycloak.service';
import { mockCacheManager } from 'test/mocks/services/cacheManeger.service.mock';
import { LogCoreModule } from './log-core.module';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: CORE_LOG_OPTION,
      useValue: new LogOptions(), // Mock do valor esperado
    },
  ],
  exports: [CORE_LOG_OPTION],
})
class TestCoreLogModule {}

describe('LogCoreRepository', () => {
  let repository: LogCoreRepository;
  let model: Model<LogSistemaCoreEntity>;
  let module: TestingModule;

  const urlBase = 'http://host.com';
  const options = mockAuthorizationOption();
  const urlAuth = `${options.authServerUrl}/realms/${options.client.realm}/protocol/openid-connect/token`;
  const mockAxios = new MockAdapter(axios);
  const cache = mockCacheManager();
  const authServer = new AuthServerKeycloakService(options, cache);
  const httpRequest = new HttpCoreService(mockAuthorizationOption(), authServer, mockRequestInfoCoreService(), false);

  beforeAll(async () => {
    const now = new Date();
    const day = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`; // DD/MM/YYYY

    module = await Test.createTestingModule({
      imports: [
        TestCoreLogModule,
        MongooseModule.forRoot('mongodb://localhost:27017/plugin-core-test-' + day),
        LogCoreModule,
      ],
    }).compile();

    repository = module.get<LogCoreRepository>(LogCoreRepository);
    model = module.get<Model<LogSistemaCoreEntity>>(getModelToken(LogSistemaCoreEntity.name));
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
