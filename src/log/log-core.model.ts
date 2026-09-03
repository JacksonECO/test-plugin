export interface LogSistemaCreateModel {
  message: string;
  tipo?: string;
  statusCode?: number;
  request?: any;
  response?: any;

  /** Sobrescreve o `systemName` vindo de `LogOptions.systemName`. */
  systemName?: string;

  /** IP de origem. Quando omitido, é capturado do contexto se `LogOptions.salvarIp` estiver ativo. */
  ip?: string;

  /** Id de correlação. Quando omitido, é capturado do contexto se `LogOptions.salvarCorrelationId` estiver ativo. */
  correlationId?: string;
}

export interface LogSistemaModel extends LogSistemaCreateModel {
  dataOcorrencia: Date;
  user: string;

  message: string;
  tipo?: string;
  statusCode?: number;
  request?: any;
  response?: any;
}

export interface LogSistemaRequestModel {
  url: string;
  method: string;
  statusCode: number;
  request?: any;
  response?: any;
  info?: Record<string, string | number>;
  tipo?: string;
  message?: string;

  /** Sobrescreve o `systemName` vindo de `LogOptions.systemName`. */
  systemName?: string;

  /** IP de origem. Quando omitido, é capturado do contexto se `LogOptions.salvarIp` estiver ativo. */
  ip?: string;

  /** Id de correlação. Quando omitido, é capturado do contexto se `LogOptions.salvarCorrelationId` estiver ativo. */
  correlationId?: string;
}
