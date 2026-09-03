import { Controller, Get, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { LogConsoleCoreModule } from './log-console-core.module';
import { CORE_LOG_CONSOLE_OPTION } from '../constants';
import { LogConsoleOptions } from '../options.dto';

@Controller('teste')
class TesteController {
  @Get()
  buscar() {
    return { ok: true };
  }
}

async function buildApp(imports: any[]): Promise<INestApplication<App>> {
  const moduleRef = await Test.createTestingModule({
    imports,
    controllers: [TesteController],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}

describe('LogConsoleCoreModule', () => {
  let app: INestApplication<App>;

  afterEach(async () => {
    await app?.close();
    jest.restoreAllMocks();
  });

  it('intercepta a request logando em verbose quando importado direto (sem forRoot)', async () => {
    const verboseSpy = jest.spyOn(Logger.prototype, 'verbose').mockImplementation();
    app = await buildApp([LogConsoleCoreModule]);

    await request(app.getHttpServer()).get('/teste').expect(200);

    const mensagens = verboseSpy.mock.calls.map((call) => String(call[0]));
    expect(mensagens.some((msg) => msg.startsWith('Start Request for /teste'))).toBe(true);
    expect(mensagens.some((msg) => msg.startsWith('End Request for /teste'))).toBe(true);
  });

  it('mantém o interceptor ativo e aplica as opções do forRoot (nível e tag)', async () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    const verboseSpy = jest.spyOn(Logger.prototype, 'verbose').mockImplementation();
    app = await buildApp([LogConsoleCoreModule.forRoot({ nivel: 'log', contexto: 'MeuLog' } as LogConsoleOptions)]);

    await request(app.getHttpServer()).get('/teste').expect(200);

    expect(logSpy.mock.calls.some((call) => String(call[0]).startsWith('Start Request for /teste'))).toBe(true);
    expect(verboseSpy).not.toHaveBeenCalled();
  });

  it('não loga as rotas configuradas em rotasIgnoradas', async () => {
    const verboseSpy = jest.spyOn(Logger.prototype, 'verbose').mockImplementation();
    app = await buildApp([LogConsoleCoreModule.forRoot({ rotasIgnoradas: ['/teste'] } as LogConsoleOptions)]);

    await request(app.getHttpServer()).get('/teste').expect(200);

    expect(verboseSpy.mock.calls.some((call) => String(call[0]).includes('Request for /teste'))).toBe(false);
  });

  it('aplica os defaults de LogConsoleOptions para os campos não informados no forRoot', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LogConsoleCoreModule.forRoot({ nivel: 'log' } as LogConsoleOptions)],
    }).compile();

    expect(moduleRef.get(CORE_LOG_CONSOLE_OPTION)).toEqual(
      expect.objectContaining({ contexto: 'LoggingInterceptor', rotasIgnoradas: [] }),
    );
  });
});
