import { WebhookConfigOptions, WebhookOptions } from 'src/options.dto';
import { WebhookCoreModel } from './webhook.model';
import { HttpCoreService } from 'src/http/http-core.service';
import { WebhookExceptionDTO } from './webhook-core.exception';
import { Method } from 'axios';
import { GuardianCoreService } from 'src/guardian/guardian-core.service';
export declare class WebhookCoreService {
  private webhookOption;
  private http;
  private guardianCoreService;
  private logger;
  constructor(webhookOption: WebhookOptions, http: HttpCoreService, guardianCoreService: GuardianCoreService);
  getWebhookUrl(event: string, agencia: string): Promise<WebhookCoreModel[]>;
  send(
    event: string,
    agencia: string,
    body: any,
    methodHttp: Method,
    customOption?: Partial<WebhookConfigOptions>,
  ): Promise<WebhookExceptionDTO[]>;
}
