export interface ContextoErro {
    agencia?: string;
    request?: any;
    ip?: string;
    tipoLog?: string;
    statusCode?: number;
    mensagem?: string;
    falha?: string;
}
