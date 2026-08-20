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
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const context_core_service_1 = require("../context/context-core.service");
const log_core_service_1 = require("../log/log-core.service");
const log_exclude_decorator_1 = require("./decorator/log-exclude.decorator");
const remove_fields_1 = require("./util/remove-fields");
const redact_fields_1 = require("./util/redact-fields");
let LogRequestInterceptor = class LogRequestInterceptor {
    logService;
    contextCoreService;
    reflector;
    constructor(logService, contextCoreService, reflector) {
        this.logService = logService;
        this.contextCoreService = contextCoreService;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const logExclude = this.reflector.getAllAndOverride(log_exclude_decorator_1.META_LOG_EXCLUDE, [
            context.getClass(),
            context.getHandler(),
        ]);
        this.contextCoreService.set('setInfoRequest', (dto) => {
            request._info = dto;
        });
        return next.handle().pipe((0, operators_1.tap)((response) => {
            const responseHttp = httpContext.getResponse();
            this.logService.salvarRequest({
                url: request.path || request.config?.url || request.url,
                method: request.method,
                request: this.buildRequestLog(request, logExclude),
                response: this.buildResponseLog(response, logExclude),
                statusCode: responseHttp?.statusCode,
                info: request._info,
            });
        }), (0, operators_1.catchError)((error) => {
            delete error.response?.req;
            this.logService.salvarRequest({
                url: request.path || request.config?.url || request.url,
                method: request.method,
                statusCode: error.status || 500,
                request: this.buildRequestLog(request, logExclude),
                response: this.buildResponseLog(error.response || error.message, logExclude),
                info: request._info,
            });
            throw error;
        }));
    }
    buildRequestLog(request, logExclude) {
        if (logExclude?.excludeRequest) {
            return undefined;
        }
        const requestFormat = {
            body: request?.body,
            params: request?.params,
            query: request?.query,
        };
        const semCamposRemovidos = (0, remove_fields_1.removeFields)(requestFormat, logExclude?.requestFields);
        return (0, redact_fields_1.redactFields)(semCamposRemovidos, logExclude?.requestFieldsRedact);
    }
    buildResponseLog(response, logExclude) {
        if (logExclude?.excludeResponse) {
            return undefined;
        }
        const semCamposRemovidos = (0, remove_fields_1.removeFields)(response, logExclude?.responseFields);
        return (0, redact_fields_1.redactFields)(semCamposRemovidos, logExclude?.responseFieldsRedact);
    }
};
exports.LogRequestInterceptor = LogRequestInterceptor;
exports.LogRequestInterceptor = LogRequestInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [log_core_service_1.LogCoreService,
        context_core_service_1.ContextCoreService,
        core_1.Reflector])
], LogRequestInterceptor);
//# sourceMappingURL=log-request.interceptor.js.map