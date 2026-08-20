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
exports.RegistraErroMongoCoreService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../constants");
const options_dto_1 = require("../../options.dto");
let RegistraErroMongoCoreService = class RegistraErroMongoCoreService {
    logRepository;
    options;
    constructor(logRepository, options) {
        this.logRepository = logRepository;
        this.options = options;
    }
    async registrar(erroIdentificado, contexto) {
        const erroOriginal = erroIdentificado.erroOriginal;
        await this.logRepository.salvarRequisicao({
            tipo: contexto?.tipoLog ?? this.options.tipoLogPadrao,
            statusCode: contexto?.statusCode ?? erroIdentificado.statusCode,
            message: contexto?.mensagem ?? erroIdentificado.mensagem,
            request: contexto?.request,
            response: {
                name: erroOriginal?.name,
                message: erroOriginal?.message,
                stack: erroOriginal?.stack,
            },
        });
    }
    async registrarSempre(mensagem, contexto) {
        await this.logRepository.salvarRequisicao({
            tipo: contexto?.tipoLog ?? this.options.tipoLogPadrao,
            statusCode: contexto?.statusCode ?? 500,
            message: mensagem,
            request: contexto?.request,
        });
    }
};
exports.RegistraErroMongoCoreService = RegistraErroMongoCoreService;
exports.RegistraErroMongoCoreService = RegistraErroMongoCoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.CORE_TRATAMENTO_ERRO_LOG_REPOSITORY)),
    __param(1, (0, common_1.Inject)(constants_1.CORE_TRATAMENTO_ERRO_OPTION)),
    __metadata("design:paramtypes", [Object, options_dto_1.TratamentoErroOptions])
], RegistraErroMongoCoreService);
//# sourceMappingURL=registra-erro-mongo-core.service.js.map