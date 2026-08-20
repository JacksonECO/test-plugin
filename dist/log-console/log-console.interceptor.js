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
exports.LogConsoleInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const request_info_core_service_1 = require("../request-info/request-info-core.service");
const log_exclude_decorator_1 = require("../log-request/decorator/log-exclude.decorator");
const remove_fields_1 = require("../log-request/util/remove-fields");
const redact_fields_1 = require("../log-request/util/redact-fields");
const OMITIDO = '"[omitido]"';
let LogConsoleInterceptor = class LogConsoleInterceptor {
    requestInfoCoreService;
    reflector;
    logger = new common_1.Logger('Request');
    constructor(requestInfoCoreService, reflector) {
        this.requestInfoCoreService = requestInfoCoreService;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const now = Date.now();
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const responseHttp = httpContext.getResponse();
        const routePath = request.path || request.config?.url || request.url;
        const routePathClean = routePath?.includes('?') ? routePath.substring(0, routePath.indexOf('?')) : routePath;
        const user = this.requestInfoCoreService.getUserEmail() || this.getIP(request);
        const logExclude = this.reflector.getAllAndOverride(log_exclude_decorator_1.META_LOG_EXCLUDE, [
            context.getClass(),
            context.getHandler(),
        ]);
        const formattedRequestBody = this.formatRequestBody(request, logExclude);
        this.logger.verbose(`${request.method} ${user}\n${routePath}\n${formattedRequestBody}`, `Start ${routePathClean}`);
        return next.handle().pipe((0, operators_1.tap)((response) => {
            const bigResponse = this.formatResponse(response, logExclude);
            this.logger.verbose(`${request.method}::${responseHttp?.statusCode ?? ''} ${user} ${Date.now() - now}ms\n${bigResponse}`, `End ${routePathClean}`);
        }), (0, operators_1.catchError)((error) => {
            if (error.response) {
                error.response.request = undefined;
            }
            this.logger.error(`Error::${error.status} ${routePathClean} ${user} ${Date.now() - now}ms\n${this.formatResponse(error.response || error.message, logExclude)}`, error?.stack?.toString() ?? '', '');
            throw error;
        }));
    }
    formatRequestBody(request, logExclude) {
        if (logExclude?.excludeRequest) {
            return OMITIDO;
        }
        const wrapper = { body: request?.body ?? {} };
        const semRemovidos = (0, remove_fields_1.removeFields)(wrapper, logExclude?.requestFields);
        const semRedacted = (0, redact_fields_1.redactFields)(semRemovidos, logExclude?.requestFieldsRedact);
        return JSON.stringify(semRedacted.body).substring(0, 10000);
    }
    formatResponse(response, logExclude) {
        if (logExclude?.excludeResponse) {
            return OMITIDO;
        }
        const semRemovidos = (0, remove_fields_1.removeFields)(response ?? {}, logExclude?.responseFields);
        const semRedacted = (0, redact_fields_1.redactFields)(semRemovidos, logExclude?.responseFieldsRedact);
        return JSON.stringify(semRedacted).substring(0, 10000);
    }
    getIP(request) {
        let ip;
        const ipAddr = request.socket.remoteAddress || request.headers['x-forwarded-for'];
        if (ipAddr) {
            const list = ipAddr.split(',');
            ip = list[list.length - 1];
        }
        else {
            ip = request.socket.remoteAddress;
        }
        return ip.replace('::ffff:', '');
    }
};
exports.LogConsoleInterceptor = LogConsoleInterceptor;
exports.LogConsoleInterceptor = LogConsoleInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_info_core_service_1.RequestInfoCoreService,
        core_1.Reflector])
], LogConsoleInterceptor);
//# sourceMappingURL=log-console.interceptor.js.map