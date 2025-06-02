import { WebhookCoreModel } from './webhook.model';

const errorMessage: string = 'Erro inesperado, tente novamente mais tarde';

export interface WebhookExceptionDTO {
  webhook: WebhookCoreModel;
  error?: any;
  success?: any;
}

export class WebhookCoreException extends Error {
  protected response: WebhookExceptionDTO[] = [];
  protected event: string;
  protected agencia: string;
  protected error: WebhookExceptionDTO[] = [];

  constructor({
    message,
    error,
    response,
    event,
    agencia,
  }: {
    message?: string;
    event?: string;
    agencia?: string;
    response?: WebhookExceptionDTO[];
    error?: WebhookExceptionDTO[];
  } = {}) {
    super(message || errorMessage);
    this.event = event;
    this.agencia = agencia;
    this.response = response;
    this.error = error;

    console.error('Webhook agencia:', agencia, 'evento:', event);
  }
}

export class RequestWebhookCoreException extends WebhookCoreException {
  constructor(error: any, event: string, agencia: string) {
    super({
      event,
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
    console.error('Erro ao requisitar webhook');
  }
}

export class WebhookNotFoundException extends WebhookCoreException {
  constructor(event: string, agencia: string) {
    super({
      event,
      agencia,
    });
    console.error('Webhook não encontrado');
  }
}

export class WebhookErrorException extends WebhookCoreException {
  constructor(error: WebhookExceptionDTO[]) {
    super({
      error,
      agencia: error[0]?.webhook?.agencia,
      event: error[0]?.webhook?.evento,
    });
    console.error('Erro ao enviar webhook');
  }
}

export class WebhookPartialErrorException extends WebhookCoreException {
  constructor(error: WebhookExceptionDTO[], success: WebhookExceptionDTO[]) {
    super({
      error,
      response: success,
      agencia: error[0]?.webhook?.agencia,
      event: error[0]?.webhook?.evento,
    });
    console.error('Erro parcial ao enviar webhook');
  }
}
