export interface ContextoErro {
  /**
   * Nome da agência/contexto de origem exibido no card do Guardião.
   */
  agencia?: string;
  /**
   * Payload de origem (substitui o campo solto "str"/contexto inteiro usado hoje em cada servico).
   */
  request?: any;
  ip?: string;
  tipoLog?: string;
  statusCode?: number;
  /** Sobrescreve a mensagem derivada do erro (afeta log e notificação). */
  mensagem?: string;
  /** Sobrescreve o campo "falha" enviado ao Guardião (default: stack do erro, ou a própria mensagem). */
  falha?: string;
}
