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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRequestInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const context_core_service_1 = require("../context/context-core.service");
const log_core_service_1 = require("../log/log-core.service");
const log_custom_decorator_1 = require("./decorator/log-custom.decorator");
const remove_fields_1 = require("./util/remove-fields");
const redact_fields_1 = require("./util/redact-fields");
const constants_1 = require("../constants");
const options_dto_1 = require("../options.dto");
let LogRequestInterceptor = class LogRequestInterceptor {
    logService;
    contextCoreService;
    reflector;
    logOption;
    constructor(logService, contextCoreService, reflector, logOption) {
        this.logService = logService;
        this.contextCoreService = contextCoreService;
        this.reflector = reflector;
        this.logOption = logOption;
    }
    intercept(context, next) {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const logCustom = this.reflector.getAllAndOverride(log_custom_decorator_1.META_LOG_CUSTOM, [
            context.getClass(),
            context.getHandler(),
        ]);
        this.contextCoreService.set('setInfoRequest', (dto) => {
            request._info = dto;
        });
        const correlationId = this.getCorrelationId(request);
        if (correlationId) {
            this.contextCoreService.set(log_core_service_1.CONTEXT_CORRELATION_ID, correlationId);
        }
        return next.handle().pipe((0, operators_1.tap)((response) => {
            const responseHttp = httpContext.getResponse();
            const isSucesso = responseHttp?.statusCode >= 200 && responseHttp?.statusCode < 300;
            if (isSucesso && logCustom?.salvarSucesso === false) {
                return;
            }
            this.logService.salvarRequest({
                url: request.path || request.config?.url || request.url,
                method: request.method,
                tipo: logCustom?.tipo,
                message: logCustom?.mensagem,
                ip: this.getIp(request),
                correlationId,
                request: this.buildRequestLog(request, logCustom),
                response: this.buildResponseLog(response, isSucesso, logCustom),
                statusCode: responseHttp?.statusCode,
                info: request._info,
            });
        }), (0, operators_1.catchError)((error) => {
            delete error.response?.req;
            this.logService.salvarRequest({
                url: request.path || request.config?.url || request.url,
                method: request.method,
                statusCode: error.status || 500,
                tipo: logCustom?.tipo,
                message: logCustom?.mensagem,
                ip: this.getIp(request),
                correlationId,
                request: this.buildRequestLog(request, logCustom),
                response: this.buildResponseLog(error.response || error.message, false, logCustom),
                info: request._info,
            });
            throw error;
        }));
    }
    getCorrelationId(request) {
        if (!this.logOption?.salvarCorrelationId) {
            return undefined;
        }
        const header = this.logOption.correlationIdHeader ?? 'x-correlation-id';
        const valor = request?.headers?.[header] ?? request?.headers?.[header.toLowerCase()];
        return Array.isArray(valor) ? valor[0] : valor;
    }
    getIp(request) {
        if (!this.logOption?.salvarIp) {
            return undefined;
        }
        const ipAddr = request?.headers?.['x-forwarded-for'] || request?.socket?.remoteAddress;
        if (!ipAddr) {
            return undefined;
        }
        const list = String(ipAddr).split(',');
        return list[list.length - 1].trim().replace('::ffff:', '');
    }
    buildRequestLog(request, logCustom) {
        if (logCustom?.excluirRequest) {
            return undefined;
        }
        const requestFormat = {
            body: request?.body,
            params: request?.params,
            query: request?.query,
        };
        const semCamposRemovidos = (0, remove_fields_1.removeFields)(requestFormat, logCustom?.excluirCampoRequest);
        return (0, redact_fields_1.redactFields)(semCamposRemovidos, logCustom?.mascararCampoRequest);
    }
    buildResponseLog(response, isSucesso, logCustom) {
        if (logCustom?.excluirResponse) {
            return undefined;
        }
        if (isSucesso && logCustom?.salvarResponseSucesso === false) {
            return undefined;
        }
        const semCamposRemovidos = (0, remove_fields_1.removeFields)(response, logCustom?.excluirCampoResponse);
        return (0, redact_fields_1.redactFields)(semCamposRemovidos, logCustom?.mascararCampoResponse);
    }
};
exports.LogRequestInterceptor = LogRequestInterceptor;
exports.LogRequestInterceptor = LogRequestInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Optional)()),
    __param(3, (0, common_1.Inject)(constants_1.CORE_LOG_OPTION)),
    __metadata("design:paramtypes", [log_core_service_1.LogCoreService,
        context_core_service_1.ContextCoreService,
        core_1.Reflector,
        options_dto_1.LogOptions])
], LogRequestInterceptor);
//# sourceMappingURL=log-request.interceptor.js.map