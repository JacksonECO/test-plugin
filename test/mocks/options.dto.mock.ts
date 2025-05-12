import { faker } from '@faker-js/faker';
import { PluginCoreOption, AuthorizationOption, UserOptions, ClientOptions } from '../../src/options.dto';

export const mockPluginCoreOption = (): PluginCoreOption => ({
  authorization: mockAuthorizationOption(),
});

export const mockAuthorizationOption = (): AuthorizationOption => ({
  authServerUrl: 'http://mock-auth-server',
  isCoreServiceAuth: faker.datatype.boolean(),
  isTokenRequestDefault: faker.datatype.boolean(),
  user: mockUserOptions(),
  client: mockClientOptions(),
});

export const mockUserOptions = (): UserOptions => ({
  username: 'mock-username',
  password: 'mock-password',
});

export const mockClientOptions = (): ClientOptions => ({
  id: 'mock-client-id',
  secret: 'mock-client-secret',
  realm: 'mock-realm',
});
