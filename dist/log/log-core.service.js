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
var LogCoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogCoreService = void 0;
const common_1 = require("@nestjs/common");
const log_core_repository_1 = require("./log-core.repository");
const request_info_core_service_1 = require("../request-info/request-info-core.service");
let LogCoreService = LogCoreService_1 = class LogCoreService {
    repository;
    requestInfo;
    logger = new common_1.Logger(LogCoreService_1.name + 'Plugin');
    constructor(repository, requestInfo) {
        this.repository = repository;
        this.requestInfo = requestInfo;
    }
    async salvarLog(dto) {
        try {
            await this.repository.save({
                ...dto,
                request: this.cleanRequest(dto.request),
                response: this.cleanRequest(dto.response),
                dataOcorrencia: new Date(),
                user: this.requestInfo.getUserEmail(),
            });
        }
        catch (error) {
            this.logger.error('Erro ao salvar um log', error);
        }
    }
    async salvarRequest(dto) {
        try {
            if (dto.url?.includes('?')) {
                dto.url = dto.url.substring(0, dto.url.indexOf('?'));
            }
            await this.repository.save({
                ...dto,
                request: this.cleanRequest(dto.request),
                response: this.cleanRequest(dto.response),
                dataOcorrencia: new Date(),
                user: this.requestInfo.getUserEmail(),
                tipo: 'request',
                message: dto.method + ': ' + dto.url,
                info: this.requestInfo.getInfo(),
            });
        }
        catch (error) {
            this.logger.error('Erro ao salvar uma requisição ' + dto.url, error);
        }
    }
    cleanRequest(request) {
        if (request?.['request'] || request?.['name'] == 'HttpException') {
            return {
                ...(request['data'] || {}),
                ...(request['body'] || {}),
                name: request['name'],
                message: request['message'],
                statusCode: request['status'],
                stack: request['stack'],
            };
        }
        return request;
    }
};
exports.LogCoreService = LogCoreService;
exports.LogCoreService = LogCoreService = LogCoreService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [log_core_repository_1.LogCoreRepository,
        request_info_core_service_1.RequestInfoCoreService])
], LogCoreService);
//# sourceMappingURL=log-core.service.js.map