/**
 * Representa as informações do usuário extraídas de um token de autenticação.
 */
export class UserRequest {
  /** Data de expiração do token (em formato UNIX timestamp). */
  exp: number;

  /** Data de emissão do token (em formato UNIX timestamp). */
  iat: number;

  /** Identificador único do token. */
  jti: string;

  /** URL do emissor do token. */
  iss: string;

  /** Identificador único do sujeito (usuário) associado ao token. */
  sub: string;

  /** Tipo do token (ex.: Bearer). */
  typ: string;

  /** Cliente autorizado que gerou o token. */
  azp: string;

  /** Identificador da sessão associada ao token. */
  sid: string;

  /** Escopo do token, indicando os recursos que podem ser acessados. */
  scope: string;

  /** Nome do usuário associado ao token. */
  name: string;

  /** Email do usuário associado ao token. */
  email: string;

  /** Informações sobre as roles no nível do realm. */
  realm_access: RealmAccess;

  /** Informações sobre as roles associadas aos recursos (clientes/agências). */
  resource_access: ResourceAccess;

  /** Cria uma instância a partir de um objeto JSON. */
  static fromJSON(data: any): UserRequest {
    return Object.assign(new UserRequest(), data);
  }
}

/**
 * Representa as roles disponíveis no nível do realm.
 */
export class RealmAccess {
  /** Lista de roles atribuídas ao usuário no nível do realm. */
  roles: string[];
}

/**
 * Representa o acesso aos recursos (clientes/agências) disponíveis para o usuário.
 */
export class ResourceAccess {
  /** Mapeamento de clientes/agências para suas respectivas roles. */
  [key: string]: ClientAccess;
}

/**
 * Representa as roles associadas a um cliente/agência específico.
 */
export class ClientAccess {
  /** Lista de roles atribuídas ao cliente/agência. */
  roles: string[];
}
