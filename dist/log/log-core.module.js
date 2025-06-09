"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogCoreModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const log_sistema_entity_1 = require("./log-sistema.entity");
const log_core_repository_1 = require("./log-core.repository");
const log_core_service_1 = require("./log-core.service");
const constants_1 = require("../constants");
const context_core_module_1 = require("../context/context-core.module");
let LogCoreModule = class LogCoreModule {
};
exports.LogCoreModule = LogCoreModule;
exports.LogCoreModule = LogCoreModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: log_sistema_entity_1.LogSistemaCoreEntity.name,
                    inject: [constants_1.CORE_LOG_OPTION],
                    useFactory: (logOptions) => (0, log_sistema_entity_1.createLogSistemaSchema)(logOptions.logSistemaCollectionName),
                },
            ]),
            context_core_module_1.ContextCoreModule,
        ],
        providers: [log_core_repository_1.LogCoreRepository, log_core_service_1.LogCoreService],
        exports: [log_core_service_1.LogCoreService],
    })
], LogCoreModule);
//# sourceMappingURL=log-core.module.js.map