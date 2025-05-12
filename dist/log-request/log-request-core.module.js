"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRequestCoreModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const log_request_interceptor_1 = require("./log-request.interceptor");
const log_core_module_1 = require("../log/log-core.module");
const http_forbidden_filter_1 = require("./http-forbidden.filter");
class LogRequestCoreModule {
    static request() {
        return {
            module: LogRequestCoreModule,
            imports: [log_core_module_1.LogCoreModule],
            providers: [
                {
                    provide: core_1.APP_INTERCEPTOR,
                    scope: common_1.Scope.REQUEST,
                    useClass: log_request_interceptor_1.LogRequestInterceptor,
                },
            ],
        };
    }
    static forbidden() {
        return {
            module: LogRequestCoreModule,
            imports: [log_core_module_1.LogCoreModule],
            providers: [
                {
                    provide: core_1.APP_FILTER,
                    scope: common_1.Scope.REQUEST,
                    useClass: http_forbidden_filter_1.HttpForbiddenFilter,
                },
            ],
        };
    }
}
exports.LogRequestCoreModule = LogRequestCoreModule;
//# sourceMappingURL=log-request-core.module.js.map