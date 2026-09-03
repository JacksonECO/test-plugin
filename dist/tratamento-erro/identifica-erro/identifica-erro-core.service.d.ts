import { TratamentoErroOptions } from '../../options.dto';
import { ErroIdentificado } from '../interfaces/erro-identificado.interface';
export declare class IdentificaErroCoreService {
    private options;
    constructor(options: TratamentoErroOptions);
    identificar(error: any): ErroIdentificado;
}
