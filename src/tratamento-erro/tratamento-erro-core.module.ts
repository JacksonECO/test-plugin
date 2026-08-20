import { DynamicModule, Module, Provider } from '@nestjs/common';
import { GuardianCoreModule } from '../guardian/guardian-core.module';
import { CORE_TRATAMENTO_ERRO_OPTION } from '../constants';
import { TratamentoErroOptions } from '../options.dto';
import { IdentificaErroCoreService } from './identifica-erro/identifica-erro-core.service';
import { NotificaErroGuardiaoCoreService } from './notifica-erro-guardiao/notifica-erro-guardiao-core.service';
import { RegistraErroMongoCoreService } from './registra-erro-mongo/registra-erro-mongo-core.service';
import { TratarErrosCoreService } from './tratar-erros/tratar-erros-core.service';
import { TratamentoErroCoreService } from './tratamento-erro-core.service';

/**
 * Consolida o padrão de tratamento de erro (identificar → registrar no Mongo → notificar o Guardião → relançar).
 * `logRepositoryProvider` é o único ponto de configuração exigido do consumidor: um Provider
 * do Nest ligado ao token `CORE_TRATAMENTO_ERRO_LOG_REPOSITORY`, tipicamente
 * `{ provide: CORE_TRATAMENTO_ERRO_LOG_REPOSITORY, useExisting: LogMongoRepositoryService }`
 * apontando para o repositório Mongo já existente em cada repo consumidor.
 * Se `LogMongoRepositoryService` (ou equivalente) estiver em outro módulo (não `@Global()`), passe
 * esse módulo no terceiro parâmetro `imports` para que `useExisting` consiga resolvê-lo.
 */
@Module({})
export class TratamentoErroCoreModule {
  static forRoot(
    option: TratamentoErroOptions,
    logRepositoryProvider: Provider,
    imports: DynamicModule['imports'] = [],
  ): DynamicModule {
    return {
      module: TratamentoErroCoreModule,
      imports: [GuardianCoreModule, ...imports],
      providers: [
        {
          provide: CORE_TRATAMENTO_ERRO_OPTION,
          useValue: new TratamentoErroOptions(option),
        },
        logRepositoryProvider,
        IdentificaErroCoreService,
        NotificaErroGuardiaoCoreService,
        RegistraErroMongoCoreService,
        TratarErrosCoreService,
        TratamentoErroCoreService,
      ],
      exports: [TratamentoErroCoreService],
    };
  }
}
