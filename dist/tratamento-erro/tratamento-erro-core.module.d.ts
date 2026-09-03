import { DynamicModule, Provider } from '@nestjs/common';
import { TratamentoErroOptions } from '../options.dto';
export declare class TratamentoErroCoreModule {
    static forRoot(option: TratamentoErroOptions, logRepositoryProvider: Provider, imports?: DynamicModule['imports']): DynamicModule;
}
