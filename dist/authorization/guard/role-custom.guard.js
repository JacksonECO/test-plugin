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
var RoleCustomGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleCustomGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const authorization_decorator_1 = require("../decorator/authorization.decorator");
const roles_enum_1 = require("../decorator/roles.enum");
const roles_decorator_1 = require("../decorator/roles.decorator");
const constants_1 = require("../../constants");
const options_dto_1 = require("../../options.dto");
let RoleCustomGuard = RoleCustomGuard_1 = class RoleCustomGuard {
    authorizationOption;
    reflector;
    logger = new common_1.Logger(RoleCustomGuard_1.name + 'Plugin');
    constructor(authorizationOption, reflector) {
        this.authorizationOption = authorizationOption;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isUnprotected = this.reflector.getAllAndOverride(authorization_decorator_1.META_UNPROTECTED, [
            context.getClass(),
            context.getHandler(),
        ]);
        const isUnprotectedAuth = this.reflector.getAllAndOverride(authorization_decorator_1.META_UNPROTECTED_AUTH, [
            context.getClass(),
            context.getHandler(),
        ]);
        if (isUnprotected || isUnprotectedAuth) {
            return true;
        }
        const roleMerge = roles_enum_1.RoleMerge.ALL;
        const rolesMetaDatas = [];
        if (roleMerge == roles_enum_1.RoleMerge.ALL) {
            const mergedRoleMetaData = this.reflector.getAll(roles_decorator_1.META_ROLES_CUSTOM, [
                context.getClass(),
                context.getHandler(),
            ]);
            if (mergedRoleMetaData) {
                if (Array.isArray(mergedRoleMetaData)) {
                    rolesMetaDatas.push(...mergedRoleMetaData.filter((e) => (e ? true : false)));
                }
                else {
                    rolesMetaDatas.push(mergedRoleMetaData);
                }
            }
        }
        else if (roleMerge == roles_enum_1.RoleMerge.OVERRIDE) {
            const roleMetaData = this.reflector.getAllAndOverride(roles_decorator_1.META_ROLES_CUSTOM, [
                context.getClass(),
                context.getHandler(),
            ]);
            if (roleMetaData) {
                rolesMetaDatas.push(roleMetaData);
            }
        }
        else {
            throw Error(`Tipo de mesclagem de roles desconhecido: ${roleMerge}`);
        }
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        if (!request) {
            return true;
        }
        const { user } = request;
        if (!user) {
            this.logger.warn('Nenhum token de acesso encontrado na requisição. O AuthCustomGuard precisa estar configurado para anexar o token de acesso ao request.');
            return false;
        }
        const combinedRoles = rolesMetaDatas.flatMap((x) => x.roles);
        if (combinedRoles.length === 0) {
            return true;
        }
        const roleMetaData = rolesMetaDatas[rolesMetaDatas.length - 1];
        const roleMatchingMode = roleMetaData.mode ? roleMetaData.mode : roles_enum_1.RoleMatchingMode.ALL;
        const granted = roleMatchingMode === roles_enum_1.RoleMatchingMode.ANY
            ? combinedRoles.some((role) => this.hasRole(user, role))
            : combinedRoles.every((role) => this.hasRole(user, role));
        if (!granted) {
            this.logger.verbose(`Acesso negado devido a roles incompatíveis: ${JSON.stringify(combinedRoles)}`);
            return false;
        }
        if (!roleMetaData.agenciaLocation && !roleMetaData.getAgenciaValue) {
            return true;
        }
        this.addAgenciaRequest(request, user, roleMetaData);
        return true;
    }
    hasRole(user, role) {
        if (!this.authorizationOption.client.id) {
            return false;
        }
        if (this.hasRealmRole(user, 'ROLE_ADMIN')) {
            return true;
        }
        const parts = role.split(':');
        if (parts.length === 1) {
            return this.getClientsWithRole(user, parts[0]).length > 0;
        }
        if (parts[0] === 'realm') {
            return this.hasRealmRole(user, parts[1]);
        }
        return this.hasApplicationRoleAgencia(user, parts[0], parts[1]);
    }
    hasRealmRole(user, roleName) {
        if (!user.realm_access || !user.realm_access.roles) {
            return false;
        }
        return user.realm_access.roles.find((role) => role === roleName) !== undefined;
    }
    hasApplicationRoleAgencia(user, clientId, roleName) {
        if (!user.resource_access) {
            return false;
        }
        const appRoles = user.resource_access[clientId];
        if (!appRoles) {
            return false;
        }
        return appRoles.roles.find((role) => role === roleName) !== undefined;
    }
    getClients(user) {
        if (!user?.resource_access) {
            return [];
        }
        return Object.keys(user.resource_access)
            .filter((cliente) => cliente.startsWith('agencia_'))
            .map((cliente) => cliente.split('_')[1]);
    }
    getClientsWithRole(user, role) {
        if (this.hasRealmRole(user, 'ROLE_ADMIN')) {
            return this.getClients(user);
        }
        return this.getClients(user).filter((cliente) => {
            return user.resource_access[`agencia_${cliente}`].roles.includes(role);
        });
    }
    addAgenciaRequest(request, user, roleMetaData) {
        roleMetaData.agenciaFieldName = roleMetaData.agenciaFieldName || 'agencia';
        const agencias = this.getClientsWithRole(user, roleMetaData.roles[0]);
        if (agencias.length === 0) {
            this.logger.verbose(`Usuário sem autorização: Usuário não tem acesso ao recurso: ${roleMetaData.roles[0]}`);
            throw new common_1.ForbiddenException();
        }
        if (roleMetaData.getAgenciaValue) {
            const agenciasRequest = roleMetaData.getAgenciaValue(request);
            for (const agencia of agenciasRequest) {
                if (!agencias.includes(agencia)) {
                    this.logger.verbose(`Usuário sem autorização ao recurso ${roleMetaData.roles[0]} da agência ${agencia}`);
                    throw new common_1.ForbiddenException();
                }
            }
            return;
        }
        let agenciasRequest = null;
        if (roleMetaData.agenciaLocation === 'query') {
            agenciasRequest = request.query?.[roleMetaData.agenciaFieldName];
        }
        else if (roleMetaData.agenciaLocation === 'body') {
            agenciasRequest = request.body?.[roleMetaData.agenciaFieldName];
        }
        if (!agenciasRequest) {
            agenciasRequest = [];
        }
        else if (!Array.isArray(agenciasRequest)) {
            agenciasRequest = [agenciasRequest];
        }
        if (agenciasRequest.length === 0) {
            if (roleMetaData.agenciaLocation === 'query') {
                const updatedQuery = { ...request.query };
                updatedQuery[roleMetaData.agenciaFieldName] = agencias;
                Object.defineProperty(request, 'query', {
                    value: updatedQuery,
                    writable: true,
                    configurable: true,
                });
            }
            else if (roleMetaData.agenciaLocation === 'body') {
                if (!request.body) {
                    request.body = {};
                }
                request.body[roleMetaData.agenciaFieldName] = agencias;
            }
        }
        else {
            agenciasRequest = agenciasRequest.map((agencia) => agencia.toString().padStart(4, '0'));
            for (const agencia of agenciasRequest) {
                if (!agencias.includes(agencia)) {
                    this.logger.verbose(`Usuário sem autorização ao recurso ${roleMetaData.roles[0]} da agência ${agencia}`);
                    throw new common_1.ForbiddenException();
                }
            }
        }
    }
};
exports.RoleCustomGuard = RoleCustomGuard;
exports.RoleCustomGuard = RoleCustomGuard = RoleCustomGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.CORE_AUTHORIZATION_OPTION)),
    __metadata("design:paramtypes", [options_dto_1.AuthorizationOption,
        core_1.Reflector])
], RoleCustomGuard);
//# sourceMappingURL=role-custom.guard.js.map