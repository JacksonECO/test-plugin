"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCoreRequestModule = void 0;
const common_1 = require("@nestjs/common");
const auth_server_module_1 = require("../auth-server/auth-server.module");
const request_info_core_module_1 = require("../request-info/request-info-core.module");
const http_core_request_service_1 = require("./http-core-request.service");
let HttpCoreRequestModule = class HttpCoreRequestModule {
};
exports.HttpCoreRequestModule = HttpCoreRequestModule;
exports.HttpCoreRequestModule = HttpCoreRequestModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_server_module_1.AuthServerCoreModule, request_info_core_module_1.RequestInfoCoreModule],
        providers: [
            http_core_request_service_1.HttpCoreRequestService,
            {
                provide: 'default-undefined',
                useValue: undefined,
            },
        ],
        exports: [http_core_request_service_1.HttpCoreRequestService],
    })
], HttpCoreRequestModule);
//# sourceMappingURL=http-core-request.module.js.map