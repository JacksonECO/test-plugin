import { Cache } from 'cache-manager';
import { AuthorizationOption } from 'src/options.dto';
export declare abstract class AuthServerService {
  protected authorizationOption: AuthorizationOption;
  protected cacheManager: Cache;
  static readonly keyAuthCache = 'token_auth';
  constructor(authorizationOption: AuthorizationOption, cacheManager: Cache);
  abstract validateToken(jwt: string): Promise<[boolean, any]>;
  abstract getTokenForce(): Promise<string>;
  getToken(): Promise<string>;
}
