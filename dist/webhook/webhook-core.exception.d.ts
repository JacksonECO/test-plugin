import { WebhookCoreModel } from './webhook.model';
export interface WebhookExceptionDTO {
    webhook: WebhookCoreModel;
    error?: any;
    success?: any;
}
export declare class WebhookCoreException extends Error {
    protected response: WebhookExceptionDTO[];
    protected event: string;
    protected agencia: string;
    protected error: WebhookExceptionDTO[];
    constructor({ message, error, response, event, agencia }?: {
        message?: string;
        event?: string;
        agencia?: string;
        response?: WebhookExceptionDTO[];
        error?: WebhookExceptionDTO[];
    });
}
export declare class RequestWebhookCoreException extends WebhookCoreException {
    constructor(error: any, event: string, agencia: string);
}
export declare class WebhookNotFoundException extends WebhookCoreException {
    constructor(event: string, agencia: string);
}
export declare class WebhookErrorException extends WebhookCoreException {
    constructor(error: WebhookExceptionDTO[]);
}
export declare class WebhookPartialErrorException extends WebhookCoreException {
    constructor(error: WebhookExceptionDTO[], success: WebhookExceptionDTO[]);
}
