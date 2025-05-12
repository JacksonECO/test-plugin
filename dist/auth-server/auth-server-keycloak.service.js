"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServerKeycloakService = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_server_interface_1 = require("./auth-server.interface");
const common_1 = require("@nestjs/common");
class AuthServerKeycloakService extends auth_server_interface_1.AuthServerService {
    logger = new common_1.Logger(AuthServerKeycloakService.name + 'Plugin');
    async validateToken(jwt) {
        try {
            const instance = axios_1.default.create({
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const resp = await instance.post(`${this.authorizationOption.authServerUrl}/realms/${this.authorizationOption.client.realm}/protocol/openid-connect/token/introspect`, {
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
        }
        catch (error) {
            this.logger.error(error?.response?.body ?? error?.message ?? 'Error validating token');
            return [false, {}];
        }
    }
    async getTokenForce() {
        try {
            const instance = axios_1.default.create({
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const url = this.authorizationOption.authServerUrl;
            const realm = this.authorizationOption.client.realm;
            const resp = await instance.post(`${url}/realms/${realm}/protocol/openid-connect/token`, {
                grant_type: 'password',
                client_id: this.authorizationOption.client.id,
                client_secret: this.authorizationOption.client.secret,
                username: this.authorizationOption.user.username,
                password: this.authorizationOption.user.password,
            });
            const access_token = resp.data.token_type + ' ' + resp.data.access_token;
            this.cacheManager
                .set(auth_server_interface_1.AuthServerService.keyAuthCache, access_token, resp.data.expires_in * 1000 - 60000)
                .catch(() => { });
            return access_token;
        }
        catch (error) {
            this.logger.error(error?.response?.body ?? error?.message ?? 'Falha ao realizar login internamente');
            throw new common_1.InternalServerErrorException('Tente novamente mais tarde');
        }
    }
}
exports.AuthServerKeycloakService = AuthServerKeycloakService;
//# sourceMappingURL=auth-server-keycloak.service.js.map