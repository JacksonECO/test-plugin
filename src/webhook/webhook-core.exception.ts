import { InternalServerErrorException } from '@nestjs/common';
import { WebhookModel } from './webhook.model';

const errorMessage: string = 'Erro inesperado, tente novamente mais tarde';

export class RequestWebhookWException extends InternalServerErrorException {
  constructor(message?: string, error?: string) {
    super(message || errorMessage, error || 'Não foi possível obter os webhooks para a operação');
  }
}

export class WebhookNotFoundException extends InternalServerErrorException {
  constructor(message?: string, error?: string) {
    super(message || errorMessage, error || 'Nenhum webhook encontrado para o evento');
  }
}

export class WebhookErrorException extends Error {
  constructor(
    public errors: {
      webhook: WebhookModel;
      error: any;
    }[],
  ) {
    super('Todos os webhooks falharam');
  }
}

export class WebhookPartialErrorException extends Error {
  constructor(
    public errors: {
      webhook: WebhookModel;
      error: any;
    }[],
    public successLength: number,
  ) {
    super('Operação parcialmente concluída');
  }
}
