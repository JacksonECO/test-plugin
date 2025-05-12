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
const auth_custom_guard_1 = require("./guard/auth-custom.guard");
const role_custom_guard_1 = require("./guard/role-custom.guard");
const auth_server_module_1 = require("../auth-server/auth-server.module");
let AuthorizationCoreModule = class AuthorizationCoreModule {
};
exports.AuthorizationCoreModule = AuthorizationCoreModule;
exports.AuthorizationCoreModule = AuthorizationCoreModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_server_module_1.AuthServerCoreModule],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: auth_custom_guard_1.AuthCustomGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: role_custom_guard_1.RoleCustomGuard,
            },
        ],
    })
], AuthorizationCoreModule);
//# sourceMappingURL=authorization-core.module.js.map