"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServerBackService = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_server_interface_1 = require("./auth-server.interface");
const common_1 = require("@nestjs/common");
class AuthServerBackService extends auth_server_interface_1.AuthServerService {
    logger = new common_1.Logger(AuthServerBackService.name + 'Plugin');
    async validateToken(jwt) {
        try {
            const instance = axios_1.default.create();
            const url = this.authorizationOption.authServerUrl + '/system-user/introspect';
            const resp = await instance.post(url, {
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
        }
        catch (error) {
            this.logger.error(error?.response?.body ?? error?.message ?? 'Error validating token');
            return [false, {}];
        }
    }
    async getTokenForce() {
        try {
            const url = `${this.authorizationOption.authServerUrl}/system-user/auth`;
            const login = this.authorizationOption.user;
            const instance = axios_1.default.create();
            const resp = await instance.post(url, login);
            const access_token = resp.data.data.tokenType + ' ' + resp.data.data.accessToken;
            this.cacheManager.set(auth_server_interface_1.AuthServerService.keyAuthCache, access_token, (resp.data.data.expiresIn * 1000) - 60000);
            return access_token;
        }
        catch (error) {
            this.logger.error(error?.response?.body ?? error?.message ?? 'Falha ao realizar login internamente');
            throw new common_1.InternalServerErrorException('Tente novamente mais tarde');
        }
    }
}
exports.AuthServerBackService = AuthServerBackService;
//# sourceMappingURL=auth-server-back.service.js.map