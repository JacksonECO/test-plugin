import { Cache } from 'cache-manager';
import { AuthorizationOption } from 'src/options.dto';

export abstract class AuthServerService {
  static readonly keyAuthCache = 'token_auth';

  constructor(
    protected authorizationOption: AuthorizationOption,
    protected cacheManager: Cache,
  ) {}

  abstract validateToken(jwt: string): Promise<[boolean, any]>;

  abstract getTokenForce(): Promise<string>;

  async getToken(): Promise<string> {
    const token = await this.cacheManager.get<string>(AuthServerService.keyAuthCache);
    if (token) {
      return token;
    }

    return this.getTokenForce();
  }
}
