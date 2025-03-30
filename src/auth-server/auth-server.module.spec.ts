import { Test } from '@nestjs/testing';
import { AuthServerCoreModule } from './auth-server.module';
import { AuthServerService } from './auth-server.interface';
import { mockAuthorizationOption, mockPluginCoreOption } from 'test/mocks/options.dto.mock';
import { PluginCoreModule } from 'src/plugin-core.module';
import { AuthServerKeycloakService } from './auth-server-keycloak.service';
import { AuthServerBackService } from './auth-server-back.service';

describe('AuthServerCoreModule', () => {
  it('deve fornecer o AuthServerService', async () => {
    const customModule = await Test.createTestingModule({
      imports: [
        PluginCoreModule.forRoot(mockPluginCoreOption()),
        AuthServerCoreModule,
      ],
    }).compile();

    const service = customModule.get<AuthServerService>(AuthServerService);
    expect(service).toBeDefined();
  });

  it('deve retornar AuthServerBackService quando isCoreServiceAuth for true', async () => {
    const customModule = await Test.createTestingModule({
      imports: [
        PluginCoreModule.forRoot({
          authorization: {
            ...mockAuthorizationOption(),
            isCoreServiceAuth: true,
          },
        }),
        AuthServerCoreModule,
      ],
    }).compile();

    const service = customModule.get<AuthServerService>(AuthServerService);
    expect(service).toBeInstanceOf(AuthServerBackService);
  });

  it('deve retornar AuthServerKeycloakService quando isCoreServiceAuth for false', async () => {
    const customModule = await Test.createTestingModule({
      imports: [
        PluginCoreModule.forRoot({
          authorization: {
            ...mockAuthorizationOption(),
            isCoreServiceAuth: false,
          },
        }),
        AuthServerCoreModule,
      ],
    }).compile();

    const service = customModule.get<AuthServerService>(AuthServerService);
    expect(service).toBeInstanceOf(AuthServerKeycloakService);
  });
});

