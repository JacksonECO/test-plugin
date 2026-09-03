/**
 * Contrato mínimo de persistência de log que o módulo de tratamento de erro exige do consumidor.
 * Cada consumidor liga seu `LogMongoRepositoryService` (ou equivalente) a este token
 * via `{ provide: CORE_TRATAMENTO_ERRO_LOG_REPOSITORY, useExisting: LogMongoRepositoryService }`
 * ao chamar `TratamentoErroCoreModule.forRoot(...)`.
 */
export interface TratamentoErroLogRepository {
  salvarRequisicao(dto: {
    tipo: string;
    statusCode: number;
    message?: string;
    request?: any;
    response?: any;
  }): Promise<void>;
}
