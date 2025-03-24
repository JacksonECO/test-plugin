"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationCoreModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_server_back_service_1 = require("./auth-server/auth-server-back.service");
const auth_server_keycloak_service_1 = require("./auth-server/auth-server-keycloak.service");
const auth_server_interface_1 = require("./auth-server/auth-server.interface");
const constants_1 = require("../constants");
const auth_custom_guard_1 = require("./guard/auth-custom.guard");
const role_custom_guard_1 = require("./guard/role-custom.guard");
let AuthorizationCoreModule = class AuthorizationCoreModule {
};
exports.AuthorizationCoreModule = AuthorizationCoreModule;
exports.AuthorizationCoreModule = AuthorizationCoreModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: auth_custom_guard_1.AuthCustomGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: role_custom_guard_1.RoleCustomGuard,
            },
            {
                inject: [constants_1.CORE_AUTHORIZATION_OPTION],
                provide: auth_server_interface_1.AuthServerService,
                useFactory: (authorizationOption) => {
                    if (authorizationOption.isCoreServiceAuth) {
                        return new auth_server_back_service_1.AuthServerBackService(authorizationOption);
                    }
                    else {
                        return new auth_server_keycloak_service_1.AuthServerKeycloakService(authorizationOption);
                    }
                },
            },
        ],
    })
], AuthorizationCoreModule);
//# sourceMappingURL=authorization-core.module.js.map