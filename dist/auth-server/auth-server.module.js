"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServerCoreModule = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const auth_server_keycloak_service_1 = require("./auth-server-keycloak.service");
const auth_server_back_service_1 = require("./auth-server-back.service");
const auth_server_interface_1 = require("./auth-server.interface");
const cache_manager_1 = require("@nestjs/cache-manager");
let AuthServerCoreModule = class AuthServerCoreModule {
};
exports.AuthServerCoreModule = AuthServerCoreModule;
exports.AuthServerCoreModule = AuthServerCoreModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.register({ isGlobal: false, cacheId: 'auth-core-plugin' }),
        ],
        providers: [
            {
                provide: auth_server_interface_1.AuthServerService,
                inject: [constants_1.CORE_AUTHORIZATION_OPTION, cache_manager_1.CACHE_MANAGER],
                useFactory: (authorizationOption, cacheManager) => {
                    if (authorizationOption.isCoreServiceAuth) {
                        return new auth_server_back_service_1.AuthServerBackService(authorizationOption, cacheManager);
                    }
                    else {
                        return new auth_server_keycloak_service_1.AuthServerKeycloakService(authorizationOption, cacheManager);
                    }
                },
            },
        ],
        exports: [auth_server_interface_1.AuthServerService]
    })
], AuthServerCoreModule);
//# sourceMappingURL=auth-server.module.js.map