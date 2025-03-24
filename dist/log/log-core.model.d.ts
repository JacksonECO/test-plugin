export interface LogSistemaCreateModel {
    message: string;
    tipo?: string;
    statusCode?: number;
    request?: any;
    response?: any;
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
}
