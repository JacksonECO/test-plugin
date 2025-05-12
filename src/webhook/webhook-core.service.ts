import { Inject, Injectable } from '@nestjs/common';
import { CORE_WEBHOOK_OPTION } from 'src/constants';
import { WebhookOptions } from 'src/options.dto';
import { WebhookModel } from './webhook.model';
import { HttpCoreService } from 'src/http/http-core.service';
import {
  RequestWebhookWException,
  WebhookErrorException,
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

  async getWebhookUrl(event: string, agencia: string): Promise<WebhookModel[]> {
    try {
      const webhooks = await this.http.get(this.webhookOption.url + `/webhook/${agencia}/${event}`);
      return webhooks.data.data;
    } catch (error) {
      if (error.status === 404) {
        return [];
      }
      throw new RequestWebhookWException();
    }
  }

  async send(
    event: string,
    agencia: string,
    body: any,
    methodHttp: Method,
    customOption?: WebhookOptions,
  ): Promise<void> {
    const options = customOption ? this.webhookOption.combine(customOption) : this.webhookOption;
    const webhooks = await this.getWebhookUrl(event, agencia);
    if (!webhooks || webhooks.length === 0) {
      // TODO: Verificar e enviar alerta para o guardião
      // if (options.emptyAlert) { }

      // TODO: Criar log

      if (options.emptyException) {
        throw new WebhookNotFoundException();
      }
      return;
    }

    const errosList = [];
    let success = 0;

    for await (const webhook of webhooks) {
      try {
        await this.http.request({
          method: methodHttp,
          url: webhook.url,
          data: body,
        });
        success++;
      } catch (error) {
        errosList.push({ webhook, error });
      }
    }

    // TODO: Criar log da operação

    if (errosList.length > 0) {
      // TODO: Enviar alerta para o guardião
      // if (options.successAndErrorsAlert) { }

      if (success > 0 && options.successAndErrorsException) {
        throw new WebhookPartialErrorException(errosList, success);
      }
      if (success == 0) {
        throw new WebhookErrorException(errosList);
      }
    }
  }
}
