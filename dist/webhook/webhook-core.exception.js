"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookPartialErrorException = exports.WebhookErrorException = exports.WebhookNotFoundException = exports.RequestWebhookCoreException = exports.WebhookCoreException = void 0;
const errorMessage = 'Erro inesperado, tente novamente mais tarde';
class WebhookCoreException extends Error {
    success = [];
    event;
    agencia;
    error = [];
    constructor({ message, error, success, event, agencia, } = {}) {
        super(message || errorMessage);
        this.event = event;
        this.agencia = agencia;
        this.success = success;
        this.error = error;
        console.error('Webhook agencia:', agencia, 'evento:', event);
    }
}
exports.WebhookCoreException = WebhookCoreException;
class RequestWebhookCoreException extends WebhookCoreException {
    constructor(error, event, agencia) {
        super({
            event,
            agencia,
            error: [
                {
                    webhook: {
                        id: '',
                        tipo: '',
                        evento: event,
                        agencia,
                        url: '',
                        updatedAt: new Date(),
                    },
                    error,
                },
            ],
        });
        console.log('Erro ao requisitar webhook');
    }
}
exports.RequestWebhookCoreException = RequestWebhookCoreException;
class WebhookNotFoundException extends WebhookCoreException {
    constructor(event, agencia) {
        super({
            event,
            agencia,
        });
        console.log('Webhook não encontrado');
    }
}
exports.WebhookNotFoundException = WebhookNotFoundException;
class WebhookErrorException extends WebhookCoreException {
    constructor(error) {
        super({
            error,
            agencia: error[0]?.webhook?.agencia,
            event: error[0]?.webhook?.evento,
        });
        console.log('Erro ao enviar webhook');
    }
}
exports.WebhookErrorException = WebhookErrorException;
class WebhookPartialErrorException extends WebhookCoreException {
    constructor(error, success) {
        super({
            error,
            success,
            agencia: error[0]?.webhook?.agencia,
            event: error[0]?.webhook?.evento,
        });
        console.log('Erro parcial ao enviar webhook');
    }
}
exports.WebhookPartialErrorException = WebhookPartialErrorException;
//# sourceMappingURL=webhook-core.exception.js.map