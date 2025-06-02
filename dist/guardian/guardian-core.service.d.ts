import { MessageGuardianCoreDTO } from './message-guardian-core.dto';
import { GuardianOptions } from 'src/options.dto';
export declare class GuardianCoreService {
    protected guardianOptions: GuardianOptions;
    private logger;
    constructor(guardianOptions: GuardianOptions);
    salvaRequest(request: {
        url: string;
        agencia?: string;
        title: string;
        message: string;
        body: any;
    }): Promise<void>;
    enviarErro(erroDto: any): Promise<void>;
    send(message: Omit<MessageGuardianCoreDTO, 'topLeft' | 'topRight' | 'headerText'> & {
        topLeft?: string;
        topRight?: string;
        agencia?: string;
        error?: any;
    }): Promise<void>;
    private sendRequest;
}
