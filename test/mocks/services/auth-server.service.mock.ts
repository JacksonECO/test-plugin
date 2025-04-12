import { AuthServerService } from 'src/auth-server/auth-server.interface';

export class AuthServerServiceMock extends AuthServerService {
  static tokenGerado = 'Bearer token-server';

  constructor() {
    super(undefined, undefined);
  }

  validateToken(_: string): Promise<[boolean, any]> {
    return Promise.resolve([true, {}]);
  }

  getTokenForce(): Promise<string> {
    return Promise.resolve(AuthServerServiceMock.tokenGerado);
  }

  getToken(): Promise<string> {
    return Promise.resolve(AuthServerServiceMock.tokenGerado);
  }
}

export const mockAuthServerService = (): AuthServerService => new AuthServerServiceMock();
