import { WebhookOptions } from 'src/options.dto';
import { WebhookCoreModel } from './webhook.model';
import { HttpCoreService } from 'src/http/http-core.service';
import { WebhookExceptionDTO } from './webhook-core.exception';
import { Method } from 'axios';
export declare class WebhookCoreService {
    private webhookOption;
    private http;
    constructor(webhookOption: WebhookOptions, http: HttpCoreService);
    getWebhookUrl(event: string, agencia: string): Promise<WebhookCoreModel[]>;
    send(event: string, agencia: string, body: any, methodHttp: Method, customOption?: Partial<WebhookOptions>): Promise<WebhookExceptionDTO[]>;
}
