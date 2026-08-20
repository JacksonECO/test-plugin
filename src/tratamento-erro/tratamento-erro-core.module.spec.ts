import { Test } from '@nestjs/testing';
import { TratamentoErroCoreModule } from './tratamento-erro-core.module';
import { TratamentoErroCoreService } from './tratamento-erro-core.service';
import { CORE_TRATAMENTO_ERRO_LOG_REPOSITORY } from '../constants';
import { PluginCoreModule } from '../plugin-core.module';
import { PluginCoreOption } from 'src';
import { TratamentoErroOptions } from '../options.dto';

describe('TratamentoErroCoreModule', () => {
  it('resolve TratamentoErroCoreService com as dependências configuradas via forRoot', async () => {
    const fakeLogRepository = { salvarRequisicao: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      imports: [
        PluginCoreModule.forRoot({
          authorization: {
            authServerUrl: 'http://auth ',
            user: { username: 'user', password: 'pass' },
            client: { id: 'id', secret: 'secret', realm: 'realm' },
          },
          guardian: { url: 'http://x', nameSystem: 'teste', codigoBanco: '001' },
        } as PluginCoreOption),
        TratamentoErroCoreModule.forRoot({ tipoLogPadrao: 'SYSTEM' } as unknown as TratamentoErroOptions, {
          provide: CORE_TRATAMENTO_ERRO_LOG_REPOSITORY,
          useValue: fakeLogRepository,
        }),
      ],
    }).compile();

    const service = moduleRef.get(TratamentoErroCoreService);

    expect(service).toBeInstanceOf(TratamentoErroCoreService);
  });

  it('não exporta os serviços internos, só a fachada', () => {
    const dynamicModule = TratamentoErroCoreModule.forRoot({} as unknown as TratamentoErroOptions, {
      provide: CORE_TRATAMENTO_ERRO_LOG_REPOSITORY,
      useValue: { salvarRequisicao: jest.fn() },
    });

    expect(dynamicModule.exports).toEqual([TratamentoErroCoreService]);
  });
});
