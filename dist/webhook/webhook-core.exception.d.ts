import { InternalServerErrorException } from '@nestjs/common';
import { WebhookModel } from './webhook.model';
export declare class RequestWebhookWException extends InternalServerErrorException {
    constructor(message?: string, error?: string);
}
export declare class WebhookNotFoundException extends InternalServerErrorException {
    constructor(message?: string, error?: string);
}
export declare class WebhookErrorException extends Error {
    errors: {
        webhook: WebhookModel;
        error: any;
    }[];
    constructor(errors: {
        webhook: WebhookModel;
        error: any;
    }[]);
}
export declare class WebhookPartialErrorException extends Error {
    errors: {
        webhook: WebhookModel;
        error: any;
    }[];
    successLength: number;
    constructor(errors: {
        webhook: WebhookModel;
        error: any;
    }[], successLength: number);
}
