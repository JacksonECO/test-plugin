export interface LogSistemaCreateModel {
    message: string;
    tipo?: string;
    statusCode?: number;
    request?: any;
    response?: any;
    systemName?: string;
    ip?: string;
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
    systemName?: string;
    ip?: string;
    correlationId?: string;
}
