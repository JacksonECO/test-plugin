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
exports.LogConsoleInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const request_info_core_service_1 = require("../request-info/request-info-core.service");
const log_custom_decorator_1 = require("../log-request/decorator/log-custom.decorator");
const remove_fields_1 = require("../log-request/util/remove-fields");
const redact_fields_1 = require("../log-request/util/redact-fields");
const constants_1 = require("../constants");
const options_dto_1 = require("../options.dto");
const OMITIDO = '"[omitido]"';
let LogConsoleInterceptor = class LogConsoleInterceptor {
    requestInfoCoreService;
    reflector;
    option;
    logger;
    constructor(requestInfoCoreService, reflector, option) {
        this.requestInfoCoreService = requestInfoCoreService;
        this.reflector = reflector;
        this.option = option;
        this.logger = new common_1.Logger(this.option?.contexto ?? 'LoggingInterceptor');
    }
    intercept(context, next) {
        const now = Date.now();
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const responseHttp = httpContext.getResponse();
        const routePath = request.path || request.config?.url || request.url;
        const routePathClean = routePath?.includes('?') ? routePath.substring(0, routePath.indexOf('?')) : routePath;
        const logCustom = this.reflector.getAllAndOverride(log_custom_decorator_1.META_LOG_CUSTOM, [
            context.getClass(),
            context.getHandler(),
        ]);
        const ip = this.getIP(request);
        const origem = this.getOrigem(ip);
        const logarSucesso = this.isLogAtivo() && !this.isRotaIgnorada(routePathClean);
        if (logarSucesso) {
            const formattedRequestBody = this.formatRequestBody(request, logCustom);
            this.logSucesso(`Start Request for ${routePathClean}\nmethod=${request.method} ${origem}\n${formattedRequestBody}`);
        }
        return next.handle().pipe((0, operators_1.tap)((response) => {
            const isSucesso = responseHttp?.statusCode >= 200 && responseHttp?.statusCode < 300;
            if (!logarSucesso || (isSucesso && logCustom?.salvarSucesso === false)) {
                return;
            }
            const bigResponse = this.formatResponse(response, logCustom);
            this.logSucesso(`End Request for ${routePathClean}\nmethod=${request.method}::${responseHttp?.statusCode ?? ''} ${origem} duration=${Date.now() - now}ms\n${bigResponse}`);
        }), (0, operators_1.catchError)((error) => {
            if (error.response) {
                error.response.request = undefined;
            }
            this.logger.error(`Error on route=${routePathClean} status=${error.status} ${origem} duration=${Date.now() - now}ms\n${this.formatResponse(error.response || error.message, logCustom)}`, error?.stack?.toString() ?? '');
            throw error;
        }));
    }
    logSucesso(message) {
        const nivel = this.option?.nivel ?? 'verbose';
        this.logger[nivel](message);
    }
    isLogAtivo() {
        if (this.option?.habilitado != null) {
            return this.option.habilitado;
        }
        return !process.env.LOG_REQUEST || process.env.LOG_REQUEST == 'true';
    }
    isRotaIgnorada(routePath) {
        const rotas = this.option?.rotasIgnoradas ?? [];
        if (!rotas.length || typeof routePath !== 'string') {
            return false;
        }
        return rotas.some((rota) => routePath.startsWith(rota));
    }
    getOrigem(ip) {
        const email = this.requestInfoCoreService.getUserEmail();
        return email ? `ip=${ip} user=${email}` : `ip=${ip}`;
    }
    formatRequestBody(request, logCustom) {
        if (logCustom?.excluirRequest) {
            return OMITIDO;
        }
        const wrapper = { body: request?.body ?? {} };
        const semRemovidos = (0, remove_fields_1.removeFields)(wrapper, logCustom?.excluirCampoRequest);
        const semRedacted = (0, redact_fields_1.redactFields)(semRemovidos, logCustom?.mascararCampoRequest);
        return JSON.stringify(semRedacted.body).substring(0, 10000);
    }
    formatResponse(response, logCustom) {
        if (logCustom?.excluirResponse) {
            return OMITIDO;
        }
        const semRemovidos = (0, remove_fields_1.removeFields)(response ?? {}, logCustom?.excluirCampoResponse);
        const semRedacted = (0, redact_fields_1.redactFields)(semRemovidos, logCustom?.mascararCampoResponse);
        return JSON.stringify(semRedacted).substring(0, 10000);
    }
    getIP(request) {
        const ipAddr = request?.socket?.remoteAddress || request?.headers?.['x-forwarded-for'];
        if (!ipAddr) {
            return '';
        }
        const list = String(ipAddr).split(',');
        return list[list.length - 1].replace('::ffff:', '');
    }
};
exports.LogConsoleInterceptor = LogConsoleInterceptor;
exports.LogConsoleInterceptor = LogConsoleInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Optional)()),
    __param(2, (0, common_1.Inject)(constants_1.CORE_LOG_CONSOLE_OPTION)),
    __metadata("design:paramtypes", [request_info_core_service_1.RequestInfoCoreService,
        core_1.Reflector,
        options_dto_1.LogConsoleOptions])
], LogConsoleInterceptor);
//# sourceMappingURL=log-console.interceptor.js.map