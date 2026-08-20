import { TratamentoErroOptions } from '../../options.dto';
import { ContextoErro } from '../interfaces/contexto-erro.interface';
import { ErroIdentificado } from '../interfaces/erro-identificado.interface';
import { TratamentoErroLogRepository } from '../interfaces/tratamento-erro-log.repository';
export declare class RegistraErroMongoCoreService {
    private logRepository;
    private options;
    constructor(logRepository: TratamentoErroLogRepository, options: TratamentoErroOptions);
    registrar(erroIdentificado: ErroIdentificado, contexto?: ContextoErro): Promise<void>;
    registrarSempre(mensagem: string, contexto?: ContextoErro): Promise<void>;
}
