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
exports.HttpForbiddenFilter = void 0;
const common_1 = require("@nestjs/common");
const log_core_service_1 = require("../log/log-core.service");
let HttpForbiddenFilter = class HttpForbiddenFilter {
    logService;
    constructor(logService) {
        this.logService = logService;
    }
    catch(_, host) {
        const httpContext = host.switchToHttp();
        const response = httpContext.getResponse();
        const request = httpContext.getRequest();
        const requestFormat = {
            body: request?.body,
            params: request?.params,
            query: request?.query,
        };
        const responseHttp = {
            message: 'Forbidden resource',
            error: 'Forbidden',
            statusCode: 403,
        };
        this.logService.salvarRequest({
            url: request.path || request.config?.url || request.url,
            method: request.method,
            statusCode: 403,
            request: requestFormat,
        });
        if (response.json && typeof response.json === 'function') {
            response.status(403).json(responseHttp);
        }
        else if (response.send && typeof response.send === 'function') {
            response.status(403).send(responseHttp);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
};
exports.HttpForbiddenFilter = HttpForbiddenFilter;
exports.HttpForbiddenFilter = HttpForbiddenFilter = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Catch)(common_1.ForbiddenException),
    __metadata("design:paramtypes", [log_core_service_1.LogCoreService])
], HttpForbiddenFilter);
//# sourceMappingURL=http-forbidden.filter.js.map