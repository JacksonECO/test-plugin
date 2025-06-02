import { Inject, Injectable } from '@nestjs/common';
import { CORE_WEBHOOK_OPTION } from 'src/constants';
import { WebhookOptions } from 'src/options.dto';
import { WebhookCoreModel } from './webhook.model';
import { HttpCoreService } from 'src/http/http-core.service';
import {
  RequestWebhookCoreException,
  WebhookErrorException,
  WebhookExceptionDTO,
  WebhookNotFoundException,
  WebhookPartialErrorException,
} from './webhook-core.exception';
import { Method } from 'axios';

@Injectable()
export class WebhookCoreService {
  constructor(
    @Inject(CORE_WEBHOOK_OPTION)
    private webhookOption: WebhookOptions,
    private http: HttpCoreService,
  ) {}

  async getWebhookUrl(event: string, agencia: string): Promise<WebhookCoreModel[]> {
    try {
      const webhooks = await this.http.get(this.webhookOption.url + `/webhook/${agencia}/${event}`);
      return {
        ...webhooks.data.data,
        evento: event,
        agencia: agencia,
      };
    } catch (error) {
      if (error.status === 404) {
        return [];
      }
      throw new RequestWebhookCoreException(error, event, agencia);
    }
  }

  async send(
    event: string,
    agencia: string,
    body: any,
    methodHttp: Method,
    customOption?: Partial<WebhookOptions>,
  ): Promise<WebhookExceptionDTO[]> {
    const options = customOption ? this.webhookOption.combine(customOption) : this.webhookOption;
    const webhooks = await this.getWebhookUrl(event, agencia);
    if (!webhooks || webhooks.length === 0) {
      // TODO: Verificar e enviar alerta para o guardião
      // if (options.emptyAlert) { }

      // TODO: Criar log

      if (options.emptyException) {
        throw new WebhookNotFoundException(event, agencia);
      }
      return;
    }

    const errosList: WebhookExceptionDTO[] = [];
    const outputSuccess: WebhookExceptionDTO[] = [];
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
      } catch (error) {
        errosList.push({ webhook, error });
      }
    }

    // TODO: Criar log da operação

    if (errosList.length > 0) {
      // TODO: Enviar alerta para o guardião
      // if (options.successAndErrorsAlert) { }

      if (success > 0 && options.successAndErrorsException) {
        throw new WebhookPartialErrorException(errosList, outputSuccess);
      }
      if (success == 0) {
        throw new WebhookErrorException(errosList);
      }
    }

    return outputSuccess;
  }
}
