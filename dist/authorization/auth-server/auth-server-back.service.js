"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServerBackService = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_server_interface_1 = require("./auth-server.interface");
const common_1 = require("@nestjs/common");
let AuthServerBackService = class AuthServerBackService extends auth_server_interface_1.AuthServerService {
    async validateToken(jwt) {
        try {
            const instance = axios_1.default.create();
            const url = this.authorizationOption.authServerUrl + '/system-user/introspect';
            const resp = await instance.post(url, {
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
        }
        catch (error) {
            this.logger.error(error?.response?.body ?? error?.message ?? 'Error validating token');
            return [false, {}];
        }
    }
};
exports.AuthServerBackService = AuthServerBackService;
exports.AuthServerBackService = AuthServerBackService = __decorate([
    (0, common_1.Injectable)()
], AuthServerBackService);
//# sourceMappingURL=auth-server-back.service.js.map