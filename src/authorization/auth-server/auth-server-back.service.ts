import axios from "axios";
import { AuthServerService } from "./auth-server.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthServerBackService extends AuthServerService {

  async validateToken(jwt: string): Promise<any[]> {
    try {
      const instance = axios.create();
      const url = this.authorizationOption.authServerUrl + '/system-user/introspect'
      const resp = await instance.post<any>(
        url,
        {
          token: jwt,
          client_id: this.authorizationOption.clientId,
          client_secret: this.authorizationOption.clientSecret,
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
      this.logger.error(
        error?.response?.body ?? error?.message ?? 'Error validating token',
      );
      return [false, {}];
    }
  }
}