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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRequestInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const log_core_service_1 = require("../log/log-core.service");
let LogRequestInterceptor = class LogRequestInterceptor {
    logService;
    constructor(logService) {
        this.logService = logService;
    }
    intercept(context, next) {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        return next.handle().pipe((0, operators_1.tap)((response) => {
            const responseHttp = httpContext.getResponse();
            const requestFormat = {
                body: request?.body,
                params: request?.params,
                query: request?.query,
            };
            this.logService.salvarRequest({
                url: request.path || request.config?.url || request.url,
                method: request.method,
                request: requestFormat,
                response: response,
                statusCode: responseHttp?.statusCode,
            });
        }), (0, operators_1.catchError)((error) => {
            const requestFormat = {
                body: request?.body,
                params: request?.params,
                query: request?.query,
            };
            this.logService.salvarRequest({
                url: request.path || request.config?.url || request.url,
                method: request.method,
                statusCode: error.status || 500,
                request: requestFormat,
                response: error.response || error.message,
            });
            throw error;
        }));
    }
};
exports.LogRequestInterceptor = LogRequestInterceptor;
exports.LogRequestInterceptor = LogRequestInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [log_core_service_1.LogCoreService])
], LogRequestInterceptor);
//# sourceMappingURL=log-request.interceptor.js.map