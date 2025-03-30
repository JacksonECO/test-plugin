import axios from "axios";
import { AuthServerService } from "./auth-server.interface";
import { InternalServerErrorException, Logger } from "@nestjs/common";

export class AuthServerKeycloakService extends AuthServerService {
  private logger = new Logger(AuthServerKeycloakService.name + 'Plugin');


  async validateToken(jwt: string): Promise<[boolean, any]> {
    try {
      const instance = axios.create({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const resp = await instance.post<any>(
        `${this.authorizationOption.authServerUrl}/realms/${this.authorizationOption.client.realm}/protocol/openid-connect/token/introspect`,
        {
          token: jwt,
          client_id: this.authorizationOption.client.id,
          client_secret: this.authorizationOption.client.secret,
        });

      const body = resp.data;

      return [
        body.active,
        {
          realm_access: body.realm_access,
          resource_access: body.resource_access,
        },
      ];
    } catch (error) {
      this.logger.error(
        error?.response?.body ?? error?.message ?? 'Error validating token',
      );
      return [false, {}];
    }
  }

  async getTokenForce(): Promise<string> {
    try {
      let instance = axios.create({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const url = this.authorizationOption.authServerUrl;
      const realm = this.authorizationOption.client.realm;
      const resp = await instance.post<any>(
        `${url}/realms/${realm}/protocol/openid-connect/token`,
        {
          grant_type: 'password',
          client_id: this.authorizationOption.client.id,
          client_secret: this.authorizationOption.client.secret,
          username: this.authorizationOption.user.username,
          password: this.authorizationOption.user.password,
        },
      );

      const access_token = resp.data.data.tokenType + ' ' + resp.data.data.accessToken;
      this.cacheManager.set(AuthServerService.keyAuthCache, access_token, (resp.data.data.expiresIn * 1000) - 60000);
      return access_token;
    } catch (error) {
      this.logger.error(
        error?.response?.body ?? error?.message ?? 'Falha ao realizar login internamente',
      );

      throw new InternalServerErrorException('Tente novamente mais tarde');
    }
  }
}