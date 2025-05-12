/**
 * Representa as opções gerais para o módulo do plugin core.
 */
export class PluginCoreOption {
  /**
   * Configurações de autorização.
   */
  authorization: AuthorizationOption;

  /**
   * Configurações de log.
   */
  log?: LogOptions;

  /**
   * Configurações de webhook.
   */
  webhook?: WebhookOptions;
}

/**
 * Representa as opções de autorização para o módulo do plugin core.
 */
export class AuthorizationOption {
  /**
   * URL base do servidor de autenticação ou do core banking.
   */
  authServerUrl: string;

  /**
   * Indica se o servidor a ser usado para autenticação é o core banking.
   *
   * @default `false` utiliza diretamente o servidor de autenticação.
   */
  isCoreServiceAuth?: boolean = false;

  /**
   * Indica se o token usado nas request será gerado pelo serviço atual ou reutilizado da request atual;
   *
   * Caso a request atual seja pública, o token será gerado pelo serviço;
   */
  isTokenRequestDefault: boolean = true;

  /**
   * Usuário do serviço
   */
  user: UserOptions;

  /**
   * Cliente do serviço
   */
  client: ClientOptions;
}

/**
 * Usuário do serviço
 */
export class UserOptions {
  username: string;
  password: string;
}

/**
 * Cliente do serviço
 */
export class ClientOptions {
  id: string;
  secret: string;
  realm: string;
}

/**
 * Opções de log para o módulo do plugin core.
 */
export class LogOptions {
  /**
   * Indica se o nome da coleção de log, onde será registrado as requestes e alguns logs adicionais.
   *
   * @default `log-sistema`
   */
  logSistemaCollectionName: string = 'log-sistema';
}

export class WebhookOptions {
  constructor(input?: WebhookOptions) {
    Object.assign(this, input);
  }

  /**
   * URL do webhook do serviço de webhook.
   */
  url: string;

  /**
   * Se true, caso não encontre nenhum webhook para o evento, será lançada uma exceção.\
   * Se false, não será lançada exceção.
   * @default `false`
   */
  emptyException: boolean;

  /**
   * Se true, caso ao enviar evento tenha sucesso e erro, será lançada uma exceção.\
   * Se false, não será lançada exceção, se tiver pelo menos um sucesso.\
   * Não tendo nenhum sucesso, será lançada uma exceção independente da configuração do modulo.
   * @default `true`
   */
  successAndErrorsException: boolean = true;

  /**
   * Se true, caso não encontre nenhum webhook para o evento, será enviado um alerta para o guardião.\
   * Se false, não será enviado alerta.
   * @default `false`
   */
  emptyAlert: boolean = true;

  /**
   * Se true, caso ao enviar evento tenha sucesso e erro, será enviado um alerta para o guardião.\
   * Se false, não será enviado alerta, se tiver pelo menos um sucesso.\
   * Não tendo nenhum sucesso, será enviado um alerta independente da configuração do modulo.
   * @default `true`
   */
  successAndErrorsAlert: boolean = true;

  /**
   * Se true, será registrado o log da operação em uma coleção especifica com tempo de expiração.
   * @default `false`
   */
  logOperation: boolean = false;

  /**
   * Nome da coleção de log, onde será registrado as operações do webhook.
   * @default `webhook-sender`
   */
  logCollectionName: string = 'webhook-sender';

  /**
   * Tempo de expiração do log em dias.
   * @default `15 dias`
   */
  logCollectionDuration: number = 15;

  /**
   * Combina as opções do webhook com as opções personalizadas.
   * @param custom
   * @returns `WebhookOptions` combinadas
   */
  public combine(custom: WebhookOptions): WebhookOptions {
    const defaultClass = Object.assign(new WebhookOptions(), this);
    Object.keys(custom).forEach((key) => {
      defaultClass[key] = custom[key];
    });

    return defaultClass;
  }
}
