import { WebhookOptions } from 'src/options.dto';
import { WebhookModel } from './webhook.model';
import { HttpCoreService } from 'src/http/http-core.service';
import { Method } from 'axios';
export declare class WebhookCoreService {
  private webhookOption;
  private http;
  constructor(webhookOption: WebhookOptions, http: HttpCoreService);
  getWebhookUrl(event: string, agencia: string): Promise<WebhookModel[]>;
  send(event: string, agencia: string, body: any, methodHttp: Method, customOption?: WebhookOptions): Promise<void>;
}
