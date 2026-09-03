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
var TratamentoErroCoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TratamentoErroCoreService = void 0;
const common_1 = require("@nestjs/common");
const identifica_erro_core_service_1 = require("./identifica-erro/identifica-erro-core.service");
const notifica_erro_guardiao_core_service_1 = require("./notifica-erro-guardiao/notifica-erro-guardiao-core.service");
const registra_erro_mongo_core_service_1 = require("./registra-erro-mongo/registra-erro-mongo-core.service");
const tratar_erros_core_service_1 = require("./tratar-erros/tratar-erros-core.service");
let TratamentoErroCoreService = TratamentoErroCoreService_1 = class TratamentoErroCoreService {
    identificaErroService;
    notificaErroGuardiaoService;
    registraErroMongoService;
    tratarErros;
    logger = new common_1.Logger(TratamentoErroCoreService_1.name);
    constructor(identificaErroService, notificaErroGuardiaoService, registraErroMongoService, tratarErros) {
        this.identificaErroService = identificaErroService;
        this.notificaErroGuardiaoService = notificaErroGuardiaoService;
        this.registraErroMongoService = registraErroMongoService;
        this.tratarErros = tratarErros;
    }
    async tratar(error, contexto) {
        const erroIdentificado = this.identificarComContexto(error, contexto);
        await this.registrarComProtecao(erroIdentificado, contexto);
        await this.notificaErroGuardiaoService.notificarSeNecessario(erroIdentificado, contexto);
        this.tratarErros.lancar(erroIdentificado);
    }
    async notificar(error, contexto) {
        const erroIdentificado = this.identificarComContexto(error, contexto);
        await this.registrarComProtecao(erroIdentificado, contexto);
        await this.notificaErroGuardiaoService.notificarSeNecessario(erroIdentificado, contexto);
    }
    async notificarSempre(mensagem, contexto) {
        await this.registrarSempreComProtecao(mensagem, contexto);
        await this.notificaErroGuardiaoService.notificarSempre(mensagem, contexto);
    }
    async registrarComProtecao(erroIdentificado, contexto) {
        try {
            await this.registraErroMongoService.registrar(erroIdentificado, contexto);
        }
        catch (error) {
            this.logger.error('Falha ao registrar erro no log', error?.stack ?? error);
        }
    }
    async registrarSempreComProtecao(mensagem, contexto) {
        try {
            await this.registraErroMongoService.registrarSempre(mensagem, contexto);
        }
        catch (error) {
            this.logger.error('Falha ao registrar log', error?.stack ?? error);
        }
    }
    identificarComContexto(error, contexto) {
        const erroIdentificado = this.identificaErroService.identificar(error);
        if (!contexto?.mensagem) {
            return erroIdentificado;
        }
        return { ...erroIdentificado, mensagem: contexto.mensagem };
    }
};
exports.TratamentoErroCoreService = TratamentoErroCoreService;
exports.TratamentoErroCoreService = TratamentoErroCoreService = TratamentoErroCoreService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [identifica_erro_core_service_1.IdentificaErroCoreService,
        notifica_erro_guardiao_core_service_1.NotificaErroGuardiaoCoreService,
        registra_erro_mongo_core_service_1.RegistraErroMongoCoreService,
        tratar_erros_core_service_1.TratarErrosCoreService])
], TratamentoErroCoreService);
//# sourceMappingURL=tratamento-erro-core.service.js.map