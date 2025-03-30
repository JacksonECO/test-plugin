/**
 * Representa as opções gerais para o módulo do plugin core.
 */
export class PluginCoreOption {

  /**
   * Configurações de autorização.
   */
  authorization: AuthorizationOption;
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