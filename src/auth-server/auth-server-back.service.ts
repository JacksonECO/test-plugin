import axios from 'axios';
import { AuthServerService } from './auth-server.interface';
import { InternalServerErrorException, Logger } from '@nestjs/common';

export class AuthServerBackService extends AuthServerService {
  private logger = new Logger(AuthServerBackService.name + 'Plugin');

  async validateToken(jwt: string): Promise<[boolean, any]> {
    try {
      const instance = axios.create();
      const url = this.authorizationOption.authServerUrl + '/system-user/introspect';
      const resp = await instance.post<any>(url, {
        token: jwt,
        client_id: this.authorizationOption.client.id,
        client_secret: this.authorizationOption.client.secret,
      });

      const body = resp.data;
      return [
        body.data.active,
        {
          realm_access: body.data.realm_access,
          resource_access: body.data.resource_access,
        },
      ];
    } catch (error) {
      this.logger.error(error?.response?.body ?? error?.message ?? 'Error validating token');
      return [false, {}];
    }
  }

  async getTokenForce(): Promise<string> {
    try {
      const url = `${this.authorizationOption.authServerUrl}/system-user/auth`;
      const login = this.authorizationOption.user;

      const instance = axios.create();
      const resp = await instance.post<any>(url, login);

      const access_token = resp.data.data.tokenType + ' ' + resp.data.data.accessToken;
      this.cacheManager.set(AuthServerService.keyAuthCache, access_token, resp.data.data.expiresIn * 1000 - 60000);
      return access_token;
    } catch (error) {
      this.logger.error(error?.response?.body ?? error?.message ?? 'Falha ao realizar login internamente');

      throw new InternalServerErrorException('Tente novamente mais tarde');
    }
  }
}
