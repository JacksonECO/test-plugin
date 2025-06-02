export declare class PluginCoreOption {
    constructor(input?: PluginCoreOption);
    authorization?: AuthorizationOption;
    log?: LogOptions;
    webhook?: WebhookOptions;
    guardian?: GuardianOptions;
}
export declare class AuthorizationOption {
    constructor(input?: AuthorizationOption);
    authServerUrl: string;
    isCoreServiceAuth?: boolean;
    isTokenRequestDefault: boolean;
    user: UserOptions;
    client: ClientOptions;
}
export declare class UserOptions {
    username: string;
    password: string;
}
export declare class ClientOptions {
    id: string;
    secret: string;
    realm: string;
}
export declare class LogOptions {
    constructor(input?: LogOptions);
    logSistemaCollectionName?: string;
}
export declare class WebhookConfigOptions {
    constructor(input?: WebhookConfigOptions);
    emptyException?: boolean;
    successAndErrorsException?: boolean;
    emptyAlert?: boolean;
    successAndErrorsAlert?: boolean;
    combine?(custom: Partial<WebhookOptions>): WebhookOptions;
}
export declare class WebhookOptions extends WebhookConfigOptions {
    constructor(input?: WebhookOptions);
    url: string;
    logOperation?: boolean;
    logCollectionName?: string;
    logCollectionDuration?: number;
}
export declare class GuardianOptions {
    constructor(input?: GuardianOptions);
    url: string;
    nameSystem?: string;
    codigoBanco?: string;
}
