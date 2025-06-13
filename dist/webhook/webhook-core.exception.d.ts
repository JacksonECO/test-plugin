import { WebhookCoreModel } from './webhook.model';
export interface WebhookExceptionDTO<T = any> {
    webhook: WebhookCoreModel;
    success?: T;
    error?: any;
    erroObj?: any;
    erroString?: string;
}
export declare class WebhookCoreException extends Error {
    protected success: WebhookExceptionDTO[];
    protected event: string;
    protected agencia: string;
    protected error: WebhookExceptionDTO[];
    constructor({ message, error, success, event, agencia, }?: {
        message?: string;
        event?: string;
        agencia?: string;
        success?: WebhookExceptionDTO[];
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
