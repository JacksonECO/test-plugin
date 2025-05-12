"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookPartialErrorException = exports.WebhookErrorException = exports.WebhookNotFoundException = exports.RequestWebhookWException = void 0;
const common_1 = require("@nestjs/common");
const errorMessage = 'Erro inesperado, tente novamente mais tarde';
class RequestWebhookWException extends common_1.InternalServerErrorException {
    constructor(message, error) {
        super(message || errorMessage, error || 'Não foi possível obter os webhooks para a operação');
    }
}
exports.RequestWebhookWException = RequestWebhookWException;
class WebhookNotFoundException extends common_1.InternalServerErrorException {
    constructor(message, error) {
        super(message || errorMessage, error || 'Nenhum webhook encontrado para o evento');
    }
}
exports.WebhookNotFoundException = WebhookNotFoundException;
class WebhookErrorException extends Error {
    errors;
    constructor(errors) {
        super('Todos os webhooks falharam');
        this.errors = errors;
    }
}
exports.WebhookErrorException = WebhookErrorException;
class WebhookPartialErrorException extends Error {
    errors;
    successLength;
    constructor(errors, successLength) {
        super('Operação parcialmente concluída');
        this.errors = errors;
        this.successLength = successLength;
    }
}
exports.WebhookPartialErrorException = WebhookPartialErrorException;
//# sourceMappingURL=webhook-core.exception.js.map