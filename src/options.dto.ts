/**
 * Representa as opções gerais para o módulo do plugin core.
 */
export class PluginCoreOption {
  constructor(input?: PluginCoreOption) {
    this.authorization = new AuthorizationOption(input?.authorization);
    this.log = new LogOptions(input?.log);
    this.webhook = new WebhookOptions(input?.webhook);
    this.guardian = new GuardianOptions(input?.guardian);
  }
  /**
   * Configurações de autorização.
   */
  authorization?: AuthorizationOption;

  /**
   * Configurações de log.
   */
  log?: LogOptions;

  /**
   * Configurações de webhook.
   */
  webhook?: WebhookOptions;

  /**
   * Configurações do guardião.
   */
  guardian?: GuardianOptions;
}

/**
 * Representa as opções de autorização para o módulo do plugin core.
 */
export class AuthorizationOption {
  constructor(input?: AuthorizationOption) {
    Object.assign(this, input);
    Object.assign(this.user, input.user);
    Object.assign(this.client, input.client);
  }
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
  constructor(input?: LogOptions) {
    Object.assign(this, input);
  }
  /**
   * Indica se o nome da coleção de log, onde será registrado as requestes e alguns logs adicionais.
   *
   * @default `log-sistema`
   */
  // logSistemaCollectionName?: string = 'log-sistema';
}

export class WebhookConfigOptions {
  constructor(input?: WebhookConfigOptions) {
    Object.assign(this, input);
  }

  /**
   * Se true, caso não encontre nenhum webhook para o evento, será lançada uma exceção.\
   * Se false, não será lançada exceção.
   * @default `true`
   */
  emptyException?: boolean = true;

  /**
   * Se true, caso ao enviar evento tenha sucesso e erro, será lançada uma exceção.\
   * Se false, não será lançada exceção, se tiver pelo menos um sucesso.\
   * Não tendo nenhum sucesso, será lançada uma exceção independente da configuração do modulo.
   * @default `false`
   */
  successAndErrorsException?: boolean = false;

  /**
   * Se true, caso não encontre nenhum webhook para o evento, será enviado um alerta para o guardião.\
   * Se false, não será enviado alerta.
   * @default `true`
   */
  emptyAlert?: boolean = true;

  /**
   * Se true, caso ao enviar evento tenha sucesso e erro, será enviado um alerta para o guardião.\
   * Se false, não será enviado alerta, se tiver pelo menos um sucesso.\
   * Não tendo nenhum sucesso, será enviado um alerta independente da configuração do modulo.
   * @default `true`
   */
  successAndErrorsAlert?: boolean = true;

  /**
   * Combina as opções do webhook com as opções personalizadas.
   * @param custom
   * @returns `WebhookOptions` combinadas
   */
  public combine?(custom: Partial<WebhookOptions>): WebhookOptions {
    const defaultClass = Object.assign(new WebhookOptions(), this);
    Object.keys(custom).forEach((key) => {
      defaultClass[key] = custom[key];
    });

    return defaultClass;
  }
}

export class WebhookOptions extends WebhookConfigOptions {
  constructor(input?: WebhookOptions) {
    super(input);
    Object.assign(this, input);
  }

  /**
   * URL do webhook do serviço de webhook.
   */
  url: string;

  /**
   * Se true, será registrado o log da operação em uma coleção especifica com tempo de expiração.
   * @default `false`
   */
  logOperation?: boolean = false;

  /**
   * Nome da coleção de log, onde será registrado as operações do webhook.
   * @default `webhook-sender`
   */
  // logCollectionName?: string = 'webhook-sender';

  /**
   * Tempo de expiração do log em dias.
   * @default `15 dias`
   */
  logCollectionDuration?: number = 15;
}

export class GuardianOptions {
  constructor(input?: GuardianOptions) {
    Object.assign(this, input);
  }

  /**
   * URL do serviço
   */
  url: string;
  /**
   * Nome do sistema atual que está enviando o alerta.
   */
  nameSystem?: string;
  /**
   * Código do banco
   */
  codigoBanco?: string;
}
