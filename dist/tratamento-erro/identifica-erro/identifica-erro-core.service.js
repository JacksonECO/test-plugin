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
exports.IdentificaErroCoreService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../constants");
const options_dto_1 = require("../../options.dto");
let IdentificaErroCoreService = class IdentificaErroCoreService {
    options;
    constructor(options) {
        this.options = options;
    }
    identificar(error) {
        if (error instanceof common_1.HttpException) {
            const statusCode = error.getStatus();
            const response = error.getResponse();
            const mensagemBruta = typeof response === 'string' ? response : (response?.message ?? error.message);
            return {
                mensagem: Array.isArray(mensagemBruta) ? mensagemBruta.join(', ') : mensagemBruta,
                statusCode,
                tipo: statusCode < 500 ? 'esperado' : 'inesperado',
                erroOriginal: error,
            };
        }
        if (error?.isAxiosError && error.response) {
            const statusCode = error.response.status;
            return {
                mensagem: error.response.data?.mensagem || error.response.data?.message || error.message,
                statusCode,
                tipo: statusCode < 500 ? 'esperado' : 'inesperado',
                erroOriginal: error,
            };
        }
        return {
            mensagem: error?.message || this.options.mensagemPadrao,
            statusCode: 500,
            tipo: 'inesperado',
            erroOriginal: error,
        };
    }
};
exports.IdentificaErroCoreService = IdentificaErroCoreService;
exports.IdentificaErroCoreService = IdentificaErroCoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.CORE_TRATAMENTO_ERRO_OPTION)),
    __metadata("design:paramtypes", [options_dto_1.TratamentoErroOptions])
], IdentificaErroCoreService);
//# sourceMappingURL=identifica-erro-core.service.js.map