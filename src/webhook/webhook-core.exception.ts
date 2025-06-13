import { WebhookCoreModel } from './webhook.model';

const errorMessage: string = 'Erro inesperado, tente novamente mais tarde';

export interface WebhookExceptionDTO<T = any> {
  webhook: WebhookCoreModel;
  success?: T;
  error?: any;
  erroObj?: any;
  erroString?: string;
}

export class WebhookCoreException extends Error {
  protected success: WebhookExceptionDTO[] = [];
  protected event: string;
  protected agencia: string;
  protected error: WebhookExceptionDTO[] = [];

  constructor({
    message,
    error,
    success,
    event,
    agencia,
  }: {
    message?: string;
    event?: string;
    agencia?: string;
    success?: WebhookExceptionDTO[];
    error?: WebhookExceptionDTO[];
  } = {}) {
    super(message || errorMessage);
    this.event = event;
    this.agencia = agencia;
    this.success = success;
    this.error = error;

    console.error('Webhook agencia:', agencia, 'evento:', event);
  }
}

export class RequestWebhookCoreException extends WebhookCoreException {
  constructor(error: any, event: string, agencia: string) {
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

export class WebhookNotFoundException extends WebhookCoreException {
  constructor(event: string, agencia: string) {
    super({
      event,
      agencia,
    });
    console.log('Webhook não encontrado');
  }
}

export class WebhookErrorException extends WebhookCoreException {
  constructor(error: WebhookExceptionDTO[]) {
    super({
      error,
      agencia: error[0]?.webhook?.agencia,
      event: error[0]?.webhook?.evento,
    });
    console.log('Erro ao enviar webhook');
  }
}

export class WebhookPartialErrorException extends WebhookCoreException {
  constructor(error: WebhookExceptionDTO[], success: WebhookExceptionDTO[]) {
    super({
      error,
      success,
      agencia: error[0]?.webhook?.agencia,
      event: error[0]?.webhook?.evento,
    });
    console.log('Erro parcial ao enviar webhook');
  }
}
