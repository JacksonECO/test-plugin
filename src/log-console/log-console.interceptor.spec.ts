import { of, throwError } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LogConsoleInterceptor } from './log-console.interceptor';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
import { META_LOG_CUSTOM, LogCustomOptions } from 'src/log-request/decorator/log-custom.decorator';
import { LogConsoleOptions } from 'src/options.dto';

function buildContext(request: any, response: any = { statusCode: 200 }): ExecutionContext {
  return {
    getClass: () => class {},
    getHandler: () => function handler() {},
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as unknown as ExecutionContext;
}

function buildCallHandler(result$: any): CallHandler {
  return { handle: () => result$ } as CallHandler;
}

function buildRequest(overrides: any = {}) {
  return {
    method: 'POST',
    path: '/x',
    body: {},
    socket: { remoteAddress: '127.0.0.1' },
    headers: {},
    ...overrides,
  };
}

describe('LogConsoleInterceptor', () => {
  let interceptor: LogConsoleInterceptor;
  let requestInfoCoreService: jest.Mocked<Pick<RequestInfoCoreService, 'getUserEmail'>>;
  let reflector: Reflector;
  let logSpy: jest.SpyInstance;

  const logRequestOriginal = process.env.LOG_REQUEST;

  beforeEach(() => {
    delete process.env.LOG_REQUEST;
    requestInfoCoreService = { getUserEmail: jest.fn().mockReturnValue('user@x.com') };
    reflector = new Reflector();
    buildInterceptor();
  });

  afterAll(() => {
    if (logRequestOriginal == null) {
      delete process.env.LOG_REQUEST;
    } else {
      process.env.LOG_REQUEST = logRequestOriginal;
    }
  });

  function buildInterceptor(option?: LogConsoleOptions, nivel: 'verbose' | 'log' | 'debug' = 'verbose') {
    interceptor = new LogConsoleInterceptor(
      requestInfoCoreService as unknown as RequestInfoCoreService,
      reflector,
      option,
    );
    logSpy = jest.spyOn((interceptor as any).logger, nivel).mockImplementation();
    return interceptor;
  }

  function mockLogCustom(options?: LogCustomOptions) {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation((key) => (key === META_LOG_CUSTOM ? options : undefined));
  }

  function findLog(prefix: 'Start' | 'End') {
    return logSpy.mock.calls.find((call) => call[0]?.startsWith(`${prefix} Request for`));
  }

  it('loga request e response normalmente quando não há LogCustom', (done) => {
    mockLogCustom(undefined);
    const request = buildRequest({ body: { password: 'segredo' } });

    interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc' }))).subscribe(() => {
      expect(findLog('Start')[0]).toContain('"password":"segredo"');
      expect(findLog('End')[0]).toContain('"token":"abc"');
      done();
    });
  });

  it('loga no formato do core, com method, ip, usuário, status e duração', (done) => {
    mockLogCustom(undefined);
    const request = buildRequest();

    interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
      expect(findLog('Start')[0]).toContain('Start Request for /x\nmethod=POST ip=127.0.0.1 user=user@x.com');
      expect(findLog('End')[0]).toMatch(
        /End Request for \/x\nmethod=POST::200 ip=127\.0\.0\.1 user=user@x\.com duration=\d+ms/,
      );
      done();
    });
  });

  it('usa a tag LoggingInterceptor por padrão e respeita o contexto configurado', () => {
    expect((interceptor as any).logger.context).toBe('LoggingInterceptor');

    buildInterceptor(new LogConsoleOptions({ contexto: 'MeuLog' }));
    expect((interceptor as any).logger.context).toBe('MeuLog');
  });

  it('loga no nível configurado quando nivel é informado', (done) => {
    buildInterceptor(new LogConsoleOptions({ nivel: 'log' }), 'log');
    mockLogCustom(undefined);

    interceptor.intercept(buildContext(buildRequest()), buildCallHandler(of({}))).subscribe(() => {
      expect(findLog('Start')).toBeDefined();
      expect(findLog('End')).toBeDefined();
      done();
    });
  });

  it('remove campos do request quando excluirCampoRequest é configurado', (done) => {
    mockLogCustom({ excluirCampoRequest: ['body.password'] });
    const request = buildRequest({ body: { password: 'segredo', username: 'user1' } });

    interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
      expect(findLog('Start')[0]).not.toContain('segredo');
      expect(findLog('Start')[0]).toContain('user1');
      done();
    });
  });

  it('mascara campos do response quando mascararCampoResponse é configurado', (done) => {
    mockLogCustom({ mascararCampoResponse: ['token'] });
    const request = buildRequest();

    interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc', nome: 'x' }))).subscribe(() => {
      expect(findLog('End')[0]).toContain('"token":"***"');
      expect(findLog('End')[0]).toContain('"nome":"x"');
      done();
    });
  });

  it('não loga o body do request quando excluirRequest é true', (done) => {
    mockLogCustom({ excluirRequest: true });
    const request = buildRequest({ body: { password: 'segredo' } });

    interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
      expect(findLog('Start')[0]).not.toContain('segredo');
      done();
    });
  });

  it('não loga o response quando excluirResponse é true', (done) => {
    mockLogCustom({ excluirResponse: true });
    const request = buildRequest();

    interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc' }))).subscribe(() => {
      expect(findLog('End')[0]).not.toContain('abc');
      done();
    });
  });

  it('não loga o End de sucesso quando salvarSucesso é false', (done) => {
    mockLogCustom({ salvarSucesso: false });
    const request = buildRequest();

    interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc' }))).subscribe(() => {
      expect(findLog('End')).toBeUndefined();
      done();
    });
  });

  describe('habilitado / LOG_REQUEST', () => {
    it('não loga sucesso quando a env LOG_REQUEST é false', (done) => {
      process.env.LOG_REQUEST = 'false';
      buildInterceptor();
      mockLogCustom(undefined);

      interceptor.intercept(buildContext(buildRequest()), buildCallHandler(of({}))).subscribe(() => {
        expect(logSpy).not.toHaveBeenCalled();
        done();
      });
    });

    it('a opção habilitado tem prioridade sobre a env LOG_REQUEST', (done) => {
      process.env.LOG_REQUEST = 'false';
      buildInterceptor(new LogConsoleOptions({ habilitado: true }));
      mockLogCustom(undefined);

      interceptor.intercept(buildContext(buildRequest()), buildCallHandler(of({}))).subscribe(() => {
        expect(findLog('Start')).toBeDefined();
        done();
      });
    });

    it('ainda loga o erro mesmo com o log de sucesso desabilitado', (done) => {
      buildInterceptor(new LogConsoleOptions({ habilitado: false }));
      const errorSpy = jest.spyOn((interceptor as any).logger, 'error').mockImplementation();
      mockLogCustom(undefined);
      const error: any = new Error('falhou');
      error.status = 500;

      interceptor.intercept(buildContext(buildRequest()), buildCallHandler(throwError(() => error))).subscribe({
        error: () => {
          expect(logSpy).not.toHaveBeenCalled();
          expect(errorSpy).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('rotasIgnoradas', () => {
    it('não loga sucesso das rotas ignoradas (por prefixo)', (done) => {
      buildInterceptor(new LogConsoleOptions({ rotasIgnoradas: ['/ping', '/webhook'] }));
      mockLogCustom(undefined);

      interceptor
        .intercept(buildContext(buildRequest({ path: '/webhook/pix' })), buildCallHandler(of({})))
        .subscribe(() => {
          expect(logSpy).not.toHaveBeenCalled();
          done();
        });
    });

    it('continua logando as rotas que não estão na lista', (done) => {
      buildInterceptor(new LogConsoleOptions({ rotasIgnoradas: ['/ping'] }));
      mockLogCustom(undefined);

      interceptor.intercept(buildContext(buildRequest({ path: '/pix' })), buildCallHandler(of({}))).subscribe(() => {
        expect(findLog('Start')).toBeDefined();
        done();
      });
    });

    it('ainda loga o erro de uma rota ignorada', (done) => {
      buildInterceptor(new LogConsoleOptions({ rotasIgnoradas: ['/ping'] }));
      const errorSpy = jest.spyOn((interceptor as any).logger, 'error').mockImplementation();
      mockLogCustom(undefined);
      const error: any = new Error('falhou');
      error.status = 500;

      interceptor
        .intercept(buildContext(buildRequest({ path: '/ping' })), buildCallHandler(throwError(() => error)))
        .subscribe({
          error: () => {
            expect(errorSpy).toHaveBeenCalled();
            done();
          },
        });
    });
  });

  describe('erro', () => {
    it('loga o erro quando ele é uma instância de Error normal (com stack)', (done) => {
      mockLogCustom(undefined);
      const errorSpy = jest.spyOn((interceptor as any).logger, 'error').mockImplementation();
      const request = buildRequest();
      const error: any = new Error('falhou');
      error.status = 500;

      interceptor.intercept(buildContext(request), buildCallHandler(throwError(() => error))).subscribe({
        error: () => {
          expect(errorSpy.mock.calls[0][0]).toContain('Error on route=/x status=500 ip=127.0.0.1 user=user@x.com');
          done();
        },
      });
    });

    it('não lança um erro diferente (TypeError) e ainda loga quando o erro lançado não tem .stack', (done) => {
      mockLogCustom(undefined);
      const errorSpy = jest.spyOn((interceptor as any).logger, 'error').mockImplementation();
      const request = buildRequest();
      // erro "cru" sem stack, ex: `throw { status: 400, message: 'x' }` ou uma rejeição não-Error
      const error: any = { status: 400, message: 'erro sem stack' };

      interceptor.intercept(buildContext(request), buildCallHandler(throwError(() => error))).subscribe({
        error: (thrown) => {
          expect(thrown).toBe(error);
          expect(errorSpy).toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
