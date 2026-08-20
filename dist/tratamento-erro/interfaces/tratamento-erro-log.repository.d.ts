export interface TratamentoErroLogRepository {
    salvarRequisicao(dto: {
        tipo: string;
        statusCode: number;
        message?: string;
        request?: any;
        response?: any;
    }): Promise<void>;
}
