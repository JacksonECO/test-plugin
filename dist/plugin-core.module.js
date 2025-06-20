"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PluginCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginCoreModule = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const options_dto_1 = require("./options.dto");
let PluginCoreModule = PluginCoreModule_1 = class PluginCoreModule {
    static forRoot(option) {
        return {
            module: PluginCoreModule_1,
            imports: [],
            providers: [
                {
                    provide: constants_1.CORE_PLUGIN_OPTION,
                    useValue: new options_dto_1.PluginCoreOption(option),
                },
                {
                    provide: constants_1.CORE_AUTHORIZATION_OPTION,
                    useValue: new options_dto_1.AuthorizationOption(option.authorization),
                },
                {
                    provide: constants_1.CORE_LOG_OPTION,
                    useValue: new options_dto_1.LogOptions(option.log),
                },
                {
                    provide: constants_1.CORE_WEBHOOK_OPTION,
                    useValue: new options_dto_1.WebhookOptions(option.webhook),
                },
                {
                    provide: constants_1.CORE_GUARDIAN_OPTION,
                    useValue: new options_dto_1.GuardianOptions(option.guardian),
                },
            ],
            exports: [
                constants_1.CORE_PLUGIN_OPTION,
                constants_1.CORE_AUTHORIZATION_OPTION,
                constants_1.CORE_LOG_OPTION,
                constants_1.CORE_WEBHOOK_OPTION,
                constants_1.CORE_GUARDIAN_OPTION,
            ],
        };
    }
};
exports.PluginCoreModule = PluginCoreModule;
exports.PluginCoreModule = PluginCoreModule = PluginCoreModule_1 = __decorate([
    (0, common_1.Global)()
], PluginCoreModule);
//# sourceMappingURL=plugin-core.module.js.map