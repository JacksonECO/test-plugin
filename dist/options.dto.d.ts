export declare class PluginCoreOption {
  authorization: AuthorizationOption;
  log?: LogOptions;
  webhook?: WebhookOptions;
}
export declare class AuthorizationOption {
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
  logSistemaCollectionName: string;
}
export declare class WebhookOptions {
  constructor(input?: WebhookOptions);
  url: string;
  emptyException: boolean;
  successAndErrorsException: boolean;
  emptyAlert: boolean;
  successAndErrorsAlert: boolean;
  logOperation: boolean;
  logCollectionName: string;
  logCollectionDuration: number;
  combine(custom: WebhookOptions): WebhookOptions;
}
