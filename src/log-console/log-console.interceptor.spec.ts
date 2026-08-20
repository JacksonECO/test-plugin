import { of, throwError } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LogConsoleInterceptor } from './log-console.interceptor';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
import { META_LOG_EXCLUDE, LogExcludeOptions } from 'src/log-request/decorator/log-exclude.decorator';

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

  beforeEach(() => {
    requestInfoCoreService = { getUserEmail: jest.fn().mockReturnValue('user@x.com') };
    reflector = new Reflector();
    interceptor = new LogConsoleInterceptor(requestInfoCoreService as unknown as RequestInfoCoreService, reflector);
    logSpy = jest.spyOn((interceptor as any).logger, 'verbose').mockImplementation();
  });

  function mockLogExclude(options?: LogExcludeOptions) {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation((key) => (key === META_LOG_EXCLUDE ? options : undefined));
  }

  it('loga request e response normalmente quando não há LogExclude', (done) => {
    mockLogExclude(undefined);
    const request = buildRequest({ body: { password: 'segredo' } });

    interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc' }))).subscribe(() => {
      const startCall = logSpy.mock.calls.find((call) => call[1]?.startsWith('Start'));
      expect(startCall[0]).toContain('"password":"segredo"');
      done();
    });
  });

  it('remove campos do request quando requestFields é configurado', (done) => {
    mockLogExclude({ requestFields: ['body.password'] });
    const request = buildRequest({ body: { password: 'segredo', username: 'user1' } });

    interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
      const startCall = logSpy.mock.calls.find((call) => call[1]?.startsWith('Start'));
      expect(startCall[0]).not.toContain('segredo');
      expect(startCall[0]).toContain('user1');
      done();
    });
  });

  it('redact campos do response quando responseFieldsRedact é configurado', (done) => {
    mockLogExclude({ responseFieldsRedact: ['token'] });
    const request = buildRequest();

    interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc', nome: 'x' }))).subscribe(() => {
      const endCall = logSpy.mock.calls.find((call) => call[1]?.startsWith('End'));
      expect(endCall[0]).toContain('"token":"***"');
      expect(endCall[0]).toContain('"nome":"x"');
      done();
    });
  });

  it('não loga o body do request quando excludeRequest é true', (done) => {
    mockLogExclude({ excludeRequest: true });
    const request = buildRequest({ body: { password: 'segredo' } });

    interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
      const startCall = logSpy.mock.calls.find((call) => call[1]?.startsWith('Start'));
      expect(startCall[0]).not.toContain('segredo');
      done();
    });
  });

  it('não loga o response quando excludeResponse é true', (done) => {
    mockLogExclude({ excludeResponse: true });
    const request = buildRequest();

    interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc' }))).subscribe(() => {
      const endCall = logSpy.mock.calls.find((call) => call[1]?.startsWith('End'));
      expect(endCall[0]).not.toContain('abc');
      done();
    });
  });

  describe('erro', () => {
    it('loga o erro quando ele é uma instância de Error normal (com stack)', (done) => {
      mockLogExclude(undefined);
      const errorSpy = jest.spyOn((interceptor as any).logger, 'error').mockImplementation();
      const request = buildRequest();
      const error: any = new Error('falhou');
      error.status = 500;

      interceptor.intercept(buildContext(request), buildCallHandler(throwError(() => error))).subscribe({
        error: () => {
          expect(errorSpy).toHaveBeenCalled();
          done();
        },
      });
    });

    it('não lança um erro diferente (TypeError) e ainda loga quando o erro lançado não tem .stack', (done) => {
      mockLogExclude(undefined);
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
