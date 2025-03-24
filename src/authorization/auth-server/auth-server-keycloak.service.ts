import axios from "axios";
import { AuthServerService } from "./auth-server.interface";

export class AuthServerKeycloakService extends AuthServerService {
  async validateToken(jwt: string): Promise<any[]> {
    try {
      const instance = axios.create({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const resp = await instance.post<any>(
        `${this.authorizationOption.authServerUrl}/realms/${this.authorizationOption.realm}/protocol/openid-connect/token/introspect`,
        {
          token: jwt,
          client_id: this.authorizationOption.clientId,
          client_secret: this.authorizationOption.clientSecret,
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
}