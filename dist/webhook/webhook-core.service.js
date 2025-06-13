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
exports.WebhookCoreService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const options_dto_1 = require("../options.dto");
const http_core_service_1 = require("../http/http-core.service");
const webhook_core_exception_1 = require("./webhook-core.exception");
const resume_erro_core_1 = require("../util/resume-erro-core");
let WebhookCoreService = class WebhookCoreService {
    webhookOption;
    http;
    constructor(webhookOption, http) {
        this.webhookOption = webhookOption;
        this.http = http;
    }
    async getWebhookUrl(event, agencia) {
        try {
            const webhooks = await this.http.get(this.webhookOption.url + `/webhook/${agencia}/${event}`);
            return webhooks.data.data.map((webhook) => {
                return {
                    ...webhook,
                    evento: event,
                    agencia: agencia,
                };
            });
        }
        catch (error) {
            if (error.status === 404) {
                return [];
            }
            throw new webhook_core_exception_1.RequestWebhookCoreException(error, event, agencia);
        }
    }
    async send(event, agencia, body, methodHttp, customOption) {
        const options = customOption ? this.webhookOption.combine(customOption) : this.webhookOption;
        const webhooks = await this.getWebhookUrl(event, agencia);
        if (!webhooks || webhooks.length === 0) {
            if (options.emptyException) {
                throw new webhook_core_exception_1.WebhookNotFoundException(event, agencia);
            }
            return [];
        }
        const errosList = [];
        const outputSuccess = [];
        let success = 0;
        for await (const webhook of webhooks) {
            try {
                const resp = await this.http.request({
                    method: methodHttp,
                    url: webhook.url,
                    data: body,
                });
                success++;
                if (resp?.data) {
                    outputSuccess.push({ webhook, success: resp.data });
                }
            }
            catch (error) {
                const obj = error.response?.data || error.response || error;
                if (typeof obj === 'object') {
                    obj.trace = undefined;
                    obj.stack = undefined;
                    obj.request = undefined;
                    obj.config = undefined;
                    obj.headers = undefined;
                }
                if (typeof obj === 'string') {
                    errosList.push({ webhook, error, erroObj: obj, erroString: obj });
                }
                else {
                    errosList.push({ webhook, error, erroObj: obj, erroString: (0, resume_erro_core_1.resumeErrorCore)(obj) });
                }
            }
        }
        if (errosList.length > 0) {
            errosList.forEach((_) => {
                console.log(errosList[errosList.length - 1].erroString);
            });
            if (success > 0 && options.successAndErrorsException) {
                throw new webhook_core_exception_1.WebhookPartialErrorException(errosList, outputSuccess);
            }
            if (success == 0) {
                throw new webhook_core_exception_1.WebhookErrorException(errosList);
            }
        }
        return [...outputSuccess, ...errosList];
    }
};
exports.WebhookCoreService = WebhookCoreService;
exports.WebhookCoreService = WebhookCoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.CORE_WEBHOOK_OPTION)),
    __metadata("design:paramtypes", [options_dto_1.WebhookOptions,
        http_core_service_1.HttpCoreService])
], WebhookCoreService);
//# sourceMappingURL=webhook-core.service.js.map