import { Inject, Injectable } from '@nestjs/common';
import { CORE_WEBHOOK_OPTION } from 'src/constants';
import { WebhookConfigOptions, WebhookOptions } from 'src/options.dto';
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
import { resumeErrorCore } from 'src/util/resume-erro-core';

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
      return webhooks.data.data.map((webhook: any) => {
        return {
          ...webhook,
          evento: event,
          agencia: agencia,
        };
      });
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
    customOption?: Partial<WebhookConfigOptions>,
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
      return [];
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
        } else {
          errosList.push({ webhook, error, erroObj: obj, erroString: resumeErrorCore(obj) });
        }
      }
    }

    // TODO: Criar log da operação

    if (errosList.length > 0) {
      errosList.forEach((_: WebhookExceptionDTO) => {
        console.log(errosList[errosList.length - 1].erroString);
        // TODO: Enviar alerta para o guardião
        // if (options.successAndErrorsAlert) { }
      });

      if (success > 0 && options.successAndErrorsException) {
        throw new WebhookPartialErrorException(errosList, outputSuccess);
      }
      if (success == 0) {
        throw new WebhookErrorException(errosList);
      }
    }

    return [...outputSuccess, ...errosList];
  }
}
