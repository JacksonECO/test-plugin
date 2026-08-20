import { IdentificaErroCoreService } from './identifica-erro/identifica-erro-core.service';
import { NotificaErroGuardiaoCoreService } from './notifica-erro-guardiao/notifica-erro-guardiao-core.service';
import { RegistraErroMongoCoreService } from './registra-erro-mongo/registra-erro-mongo-core.service';
import { TratarErrosCoreService } from './tratar-erros/tratar-erros-core.service';
import { ContextoErro } from './interfaces/contexto-erro.interface';
export declare class TratamentoErroCoreService {
    private identificaErroService;
    private notificaErroGuardiaoService;
    private registraErroMongoService;
    private tratarErros;
    private logger;
    constructor(identificaErroService: IdentificaErroCoreService, notificaErroGuardiaoService: NotificaErroGuardiaoCoreService, registraErroMongoService: RegistraErroMongoCoreService, tratarErros: TratarErrosCoreService);
    tratar(error: unknown, contexto?: ContextoErro): Promise<never>;
    notificar(error: unknown, contexto?: ContextoErro): Promise<void>;
    notificarSempre(mensagem: string, contexto?: ContextoErro): Promise<void>;
    private registrarComProtecao;
    private registrarSempreComProtecao;
    private identificarComContexto;
}
