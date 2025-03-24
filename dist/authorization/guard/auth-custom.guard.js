"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthCustomGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCustomGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const plugin_core_module_1 = require("../../plugin-core.module");
const authorization_decorator_1 = require("../decorator/authorization.decorator");
const auth_server_interface_1 = require("../auth-server/auth-server.interface");
const constants_1 = require("../../constants");
let AuthCustomGuard = AuthCustomGuard_1 = class AuthCustomGuard {
    authorizationOption;
    reflector;
    authServerService;
    logger = new common_1.Logger(AuthCustomGuard_1.name + 'Plugin');
    constructor(authorizationOption, reflector, authServerService) {
        this.authorizationOption = authorizationOption;
        this.reflector = reflector;
        this.authServerService = authServerService;
    }
    async canActivate(context) {
        const isUnprotected = this.reflector.getAllAndOverride(authorization_decorator_1.META_UNPROTECTED, [
            context.getClass(), context.getHandler()
        ]);
        if (isUnprotected) {
            return true;
        }
        const isUnprotectedAuth = this.reflector.getAllAndOverride(authorization_decorator_1.META_UNPROTECTED_AUTH, [
            context.getClass(), context.getHandler(),
        ]);
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        if (!request) {
            return true;
        }
        const jwt = this.extractJwt(request.headers);
        const isJwtEmpty = jwt === null || jwt === undefined;
        if (isJwtEmpty && isUnprotectedAuth) {
            this.logger.verbose('JWT não encontrado, mas como é opcional, foi permitido.');
            return true;
        }
        if (isJwtEmpty) {
            this.logger.verbose('JWT não encontrado, Unauthorized-401.');
            throw new common_1.UnauthorizedException();
        }
        const [isValidToken, dataAdd] = await this.authServerService.validateToken(jwt);
        if (isValidToken && dataAdd) {
            request.user = this.parseToken(jwt, dataAdd);
            this.logger.verbose(`Usuário autenticado: ${request?.user?.email}`);
            return true;
        }
        throw new common_1.UnauthorizedException();
    }
    extractJwt(headers) {
        if (headers && !headers.authorization) {
            return null;
        }
        const auth = headers.authorization.split(' ');
        if (auth[0].toLowerCase() !== 'bearer') {
            this.logger.verbose(`Tipo de autenticação inválido.`);
            return null;
        }
        return auth[1];
    }
    parseToken(token, addUser) {
        const parts = token.split('.');
        const user = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        return {
            ...user,
            ...addUser,
        };
    }
};
exports.AuthCustomGuard = AuthCustomGuard;
exports.AuthCustomGuard = AuthCustomGuard = AuthCustomGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.CORE_AUTHORIZATION_OPTION)),
    __metadata("design:paramtypes", [plugin_core_module_1.AuthorizationOption,
        core_1.Reflector,
        auth_server_interface_1.AuthServerService])
], AuthCustomGuard);
//# sourceMappingURL=auth-custom.guard.js.map