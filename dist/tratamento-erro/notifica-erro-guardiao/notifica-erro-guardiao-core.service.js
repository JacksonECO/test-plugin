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
var NotificaErroGuardiaoCoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificaErroGuardiaoCoreService = void 0;
const common_1 = require("@nestjs/common");
const guardian_core_service_1 = require("../../guardian/guardian-core.service");
const constants_1 = require("../../constants");
let NotificaErroGuardiaoCoreService = NotificaErroGuardiaoCoreService_1 = class NotificaErroGuardiaoCoreService {
    guardianCoreService;
    logRepository;
    logger = new common_1.Logger(NotificaErroGuardiaoCoreService_1.name);
    constructor(guardianCoreService, logRepository) {
        this.guardianCoreService = guardianCoreService;
        this.logRepository = logRepository;
    }
    async notificarSeNecessario(erroIdentificado, contexto) {
        if (erroIdentificado.tipo !== 'inesperado') {
            return;
        }
        await this.montarEEnviar(erroIdentificado.mensagem, erroIdentificado.erroOriginal, contexto);
    }
    async notificarSempre(mensagem, contexto) {
        await this.montarEEnviar(mensagem, null, contexto);
    }
    async montarEEnviar(mensagem, erroOriginal, contexto) {
        const erroDto = {
            falha: contexto?.falha ?? erroOriginal?.stack ?? mensagem,
            mensagem,
            agencia: contexto?.agencia ?? 'Sem informação',
            request: contexto?.request ?? {},
            ip: contexto?.ip,
        };
        try {
            await this.guardianCoreService.enviarErro(erroDto);
        }
        catch (error) {
            await this.registrarFalha(erroDto, error);
        }
    }
    async registrarFalha(payload, error) {
        this.logger.error('Falha ao enviar mensagem para o Guardião', error?.stack ?? error);
        try {
            await this.logRepository.salvarRequisicao({
                tipo: 'SYSTEM',
                statusCode: 500,
                message: 'Falha ao enviar mensagem para o Guardião',
                request: payload,
                response: {
                    name: error?.name,
                    message: error?.message,
                    stack: error?.stack,
                },
            });
        }
        catch (logError) {
            this.logger.error('Falha ao registrar log da falha do Guardião', logError?.stack ?? logError);
        }
    }
};
exports.NotificaErroGuardiaoCoreService = NotificaErroGuardiaoCoreService;
exports.NotificaErroGuardiaoCoreService = NotificaErroGuardiaoCoreService = NotificaErroGuardiaoCoreService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.CORE_TRATAMENTO_ERRO_LOG_REPOSITORY)),
    __metadata("design:paramtypes", [guardian_core_service_1.GuardianCoreService, Object])
], NotificaErroGuardiaoCoreService);
//# sourceMappingURL=notifica-erro-guardiao-core.service.js.map