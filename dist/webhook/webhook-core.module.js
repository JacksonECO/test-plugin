"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookCoreModule = void 0;
const common_1 = require("@nestjs/common");
const http_core_module_1 = require("../http/http-core.module");
const webhook_core_service_1 = require("./webhook-core.service");
const guardian_core_module_1 = require("../guardian/guardian-core.module");
let WebhookCoreModule = class WebhookCoreModule {
};
exports.WebhookCoreModule = WebhookCoreModule;
exports.WebhookCoreModule = WebhookCoreModule = __decorate([
    (0, common_1.Module)({
        imports: [http_core_module_1.HttpCoreModule, guardian_core_module_1.GuardianCoreModule],
        providers: [webhook_core_service_1.WebhookCoreService],
        exports: [webhook_core_service_1.WebhookCoreService],
    })
], WebhookCoreModule);
//# sourceMappingURL=webhook-core.module.js.map