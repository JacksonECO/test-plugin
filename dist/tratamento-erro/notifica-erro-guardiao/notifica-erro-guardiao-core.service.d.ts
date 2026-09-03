import { GuardianCoreService } from '../../guardian/guardian-core.service';
import { ContextoErro } from '../interfaces/contexto-erro.interface';
import { ErroIdentificado } from '../interfaces/erro-identificado.interface';
import { TratamentoErroLogRepository } from '../interfaces/tratamento-erro-log.repository';
export declare class NotificaErroGuardiaoCoreService {
    private guardianCoreService;
    private logRepository;
    private logger;
    constructor(guardianCoreService: GuardianCoreService, logRepository: TratamentoErroLogRepository);
    notificarSeNecessario(erroIdentificado: ErroIdentificado, contexto?: ContextoErro): Promise<void>;
    notificarSempre(mensagem: string, contexto?: ContextoErro): Promise<void>;
    private montarEEnviar;
    private registrarFalha;
}
