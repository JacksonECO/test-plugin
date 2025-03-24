"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServerKeycloakService = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_server_interface_1 = require("./auth-server.interface");
class AuthServerKeycloakService extends auth_server_interface_1.AuthServerService {
    async validateToken(jwt) {
        try {
            const instance = axios_1.default.create({
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const resp = await instance.post(`${this.authorizationOption.authServerUrl}/realms/${this.authorizationOption.realm}/protocol/openid-connect/token/introspect`, {
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
        }
        catch (error) {
            this.logger.error(error?.response?.body ?? error?.message ?? 'Error validating token');
            return [false, {}];
        }
    }
}
exports.AuthServerKeycloakService = AuthServerKeycloakService;
//# sourceMappingURL=auth-server-keycloak.service.js.map