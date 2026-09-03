"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TratamentoErroCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TratamentoErroCoreModule = void 0;
const common_1 = require("@nestjs/common");
const guardian_core_module_1 = require("../guardian/guardian-core.module");
const constants_1 = require("../constants");
const options_dto_1 = require("../options.dto");
const identifica_erro_core_service_1 = require("./identifica-erro/identifica-erro-core.service");
const notifica_erro_guardiao_core_service_1 = require("./notifica-erro-guardiao/notifica-erro-guardiao-core.service");
const registra_erro_mongo_core_service_1 = require("./registra-erro-mongo/registra-erro-mongo-core.service");
const tratar_erros_core_service_1 = require("./tratar-erros/tratar-erros-core.service");
const tratamento_erro_core_service_1 = require("./tratamento-erro-core.service");
let TratamentoErroCoreModule = TratamentoErroCoreModule_1 = class TratamentoErroCoreModule {
    static forRoot(option, logRepositoryProvider, imports = []) {
        return {
            module: TratamentoErroCoreModule_1,
            imports: [guardian_core_module_1.GuardianCoreModule, ...imports],
            providers: [
                {
                    provide: constants_1.CORE_TRATAMENTO_ERRO_OPTION,
                    useValue: new options_dto_1.TratamentoErroOptions(option),
                },
                logRepositoryProvider,
                identifica_erro_core_service_1.IdentificaErroCoreService,
                notifica_erro_guardiao_core_service_1.NotificaErroGuardiaoCoreService,
                registra_erro_mongo_core_service_1.RegistraErroMongoCoreService,
                tratar_erros_core_service_1.TratarErrosCoreService,
                tratamento_erro_core_service_1.TratamentoErroCoreService,
            ],
            exports: [tratamento_erro_core_service_1.TratamentoErroCoreService],
        };
    }
};
exports.TratamentoErroCoreModule = TratamentoErroCoreModule;
exports.TratamentoErroCoreModule = TratamentoErroCoreModule = TratamentoErroCoreModule_1 = __decorate([
    (0, common_1.Module)({})
], TratamentoErroCoreModule);
//# sourceMappingURL=tratamento-erro-core.module.js.map