"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogConsoleCoreModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const request_info_core_module_1 = require("../request-info/request-info-core.module");
const log_console_interceptor_1 = require("./log-console.interceptor");
let LogConsoleCoreModule = class LogConsoleCoreModule {
};
exports.LogConsoleCoreModule = LogConsoleCoreModule;
exports.LogConsoleCoreModule = LogConsoleCoreModule = __decorate([
    (0, common_1.Module)({
        imports: [request_info_core_module_1.RequestInfoCoreModule],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                scope: common_1.Scope.REQUEST,
                useClass: log_console_interceptor_1.LogConsoleInterceptor,
            },
        ],
    })
], LogConsoleCoreModule);
//# sourceMappingURL=log-console-core.module.js.map