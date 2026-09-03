import { Observable, of, throwError } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LogRequestInterceptor } from './log-request.interceptor';
import { LogCoreService } from 'src/log/log-core.service';
import { ContextCoreService } from 'src/context/context-core.service';
import { META_LOG_CUSTOM, LogCustomOptions } from './decorator/log-custom.decorator';
import { LogOptions } from 'src/options.dto';

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

function buildCallHandler(result$: Observable<any>): CallHandler {
  return { handle: () => result$ } as CallHandler;
}

describe('LogRequestInterceptor', () => {
  let interceptor: LogRequestInterceptor;
  let logService: jest.Mocked<Pick<LogCoreService, 'salvarRequest'>>;
  let contextCoreService: jest.Mocked<Pick<ContextCoreService, 'set'>>;
  let reflector: Reflector;

  beforeEach(() => {
    logService = { salvarRequest: jest.fn() };
    contextCoreService = { set: jest.fn() };
    reflector = new Reflector();
    interceptor = new LogRequestInterceptor(
      logService as unknown as LogCoreService,
      contextCoreService as unknown as ContextCoreService,
      reflector,
    );
  });

  function mockLogCustom(options?: LogCustomOptions) {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation((key) => (key === META_LOG_CUSTOM ? options : undefined));
  }

  describe('sucesso', () => {
    it('loga request e response normalmente quando não há LogCustom', (done) => {
      mockLogCustom(undefined);
      const request = { method: 'POST', path: '/x', body: { password: 'segredo' } };

      interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc' }))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            request: expect.objectContaining({ body: { password: 'segredo' } }),
            response: { token: 'abc' },
          }),
        );
        done();
      });
    });

    it('remove campos do request quando excluirCampoRequest é configurado', (done) => {
      mockLogCustom({ excluirCampoRequest: ['body.password'] });
      const request = { method: 'POST', path: '/x', body: { password: 'segredo', username: 'user1' } };

      interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            request: expect.objectContaining({ body: { username: 'user1' } }),
          }),
        );
        done();
      });
    });

    it('remove campos do response quando excluirCampoResponse é configurado', (done) => {
      mockLogCustom({ excluirCampoResponse: ['token'] });
      const request = { method: 'GET', path: '/x' };

      interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc', nome: 'x' }))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ response: { nome: 'x' } }));
        done();
      });
    });

    it('mascara campos do request quando mascararCampoRequest é configurado', (done) => {
      mockLogCustom({ mascararCampoRequest: ['body.password'] });
      const request = { method: 'POST', path: '/x', body: { password: 'segredo', username: 'user1' } };

      interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            request: expect.objectContaining({ body: { password: '***', username: 'user1' } }),
          }),
        );
        done();
      });
    });

    it('mascara campos do response quando mascararCampoResponse é configurado', (done) => {
      mockLogCustom({ mascararCampoResponse: ['token'] });
      const request = { method: 'GET', path: '/x' };

      interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc', nome: 'x' }))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(
          expect.objectContaining({ response: { token: '***', nome: 'x' } }),
        );
        done();
      });
    });

    it('não loga o request inteiro quando excluirRequest é true', (done) => {
      mockLogCustom({ excluirRequest: true });
      const request = { method: 'POST', path: '/x', body: { password: 'segredo' } };

      interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ request: undefined }));
        done();
      });
    });

    it('não loga o response inteiro quando excluirResponse é true', (done) => {
      mockLogCustom({ excluirResponse: true });
      const request = { method: 'GET', path: '/x' };

      interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc' }))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ response: undefined }));
        done();
      });
    });

    it('não loga o response quando salvarResponseSucesso é false e a requisição foi bem-sucedida', (done) => {
      mockLogCustom({ salvarResponseSucesso: false });
      const request = { method: 'GET', path: '/x' };

      interceptor
        .intercept(buildContext(request, { statusCode: 200 }), buildCallHandler(of({ token: 'abc' })))
        .subscribe(() => {
          expect(logService.salvarRequest).toHaveBeenCalledWith(
            expect.objectContaining({ request: expect.anything(), response: undefined }),
          );
          done();
        });
    });

    it('não persiste log nenhum quando salvarSucesso é false e a requisição foi bem-sucedida', (done) => {
      mockLogCustom({ salvarSucesso: false });
      const request = { method: 'GET', path: '/x' };

      interceptor
        .intercept(buildContext(request, { statusCode: 200 }), buildCallHandler(of({ token: 'abc' })))
        .subscribe(() => {
          expect(logService.salvarRequest).not.toHaveBeenCalled();
          done();
        });
    });

    it('persiste tipo e mensagem customizados quando configurados', (done) => {
      mockLogCustom({ tipo: 'STR', mensagem: 'Buscando todas as STR' });
      const request = { method: 'GET', path: '/x' };

      interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(
          expect.objectContaining({ tipo: 'STR', message: 'Buscando todas as STR' }),
        );
        done();
      });
    });
  });

  describe('ip e correlationId', () => {
    function buildComOption(option: LogOptions) {
      interceptor = new LogRequestInterceptor(
        logService as unknown as LogCoreService,
        contextCoreService as unknown as ContextCoreService,
        reflector,
        option,
      );
    }

    it('não captura ip nem correlationId quando a config está desligada', (done) => {
      mockLogCustom(undefined);
      const request = { method: 'GET', path: '/x', headers: { 'x-correlation-id': 'abc-123' } };

      interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(
          expect.objectContaining({ ip: undefined, correlationId: undefined }),
        );
        done();
      });
    });

    it('captura o ip da request quando salvarIp está ligado', (done) => {
      buildComOption(new LogOptions({ salvarIp: true }));
      mockLogCustom(undefined);
      const request = { method: 'GET', path: '/x', socket: { remoteAddress: '::ffff:127.0.0.1' }, headers: {} };

      interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ ip: '127.0.0.1' }));
        done();
      });
    });

    it('captura o correlationId do header e propaga no contexto', (done) => {
      buildComOption(new LogOptions({ salvarCorrelationId: true }));
      mockLogCustom(undefined);
      const request = { method: 'GET', path: '/x', headers: { 'x-correlation-id': 'abc-123' } };

      interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ correlationId: 'abc-123' }));
        expect(contextCoreService.set).toHaveBeenCalledWith('correlationId', 'abc-123');
        done();
      });
    });

    it('lê o correlationId do header configurado em correlationIdHeader', (done) => {
      buildComOption(new LogOptions({ salvarCorrelationId: true, correlationIdHeader: 'x-request-id' }));
      mockLogCustom(undefined);
      const request = { method: 'GET', path: '/x', headers: { 'x-request-id': 'req-9' } };

      interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ correlationId: 'req-9' }));
        done();
      });
    });

    it('mantém ip e correlationId no fluxo de erro', (done) => {
      buildComOption(new LogOptions({ salvarIp: true, salvarCorrelationId: true }));
      mockLogCustom(undefined);
      const request = {
        method: 'GET',
        path: '/x',
        headers: { 'x-correlation-id': 'abc-123', 'x-forwarded-for': '10.0.0.9' },
      };
      const error: any = new Error('falhou');
      error.status = 500;

      interceptor.intercept(buildContext(request), buildCallHandler(throwError(() => error))).subscribe({
        error: () => {
          expect(logService.salvarRequest).toHaveBeenCalledWith(
            expect.objectContaining({ ip: '10.0.0.9', correlationId: 'abc-123' }),
          );
          done();
        },
      });
    });
  });

  describe('erro', () => {
    it('remove campos do request também no fluxo de erro', (done) => {
      mockLogCustom({ excluirCampoRequest: ['body.password'] });
      const request = { method: 'POST', path: '/x', body: { password: 'segredo', username: 'user1' } };
      const error: any = new Error('falhou');
      error.status = 500;

      interceptor.intercept(buildContext(request), buildCallHandler(throwError(() => error))).subscribe({
        error: () => {
          expect(logService.salvarRequest).toHaveBeenCalledWith(
            expect.objectContaining({
              request: expect.objectContaining({ body: { username: 'user1' } }),
            }),
          );
          done();
        },
      });
    });

    it('ainda relança o erro original após logar', (done) => {
      mockLogCustom(undefined);
      const request = { method: 'POST', path: '/x' };
      const error: any = new Error('falhou');
      error.status = 500;

      interceptor.intercept(buildContext(request), buildCallHandler(throwError(() => error))).subscribe({
        error: (thrown) => {
          expect(thrown).toBe(error);
          done();
        },
      });
    });

    it('loga o response do erro mesmo com salvarResponseSucesso false', (done) => {
      mockLogCustom({ salvarResponseSucesso: false });
      const request = { method: 'POST', path: '/x' };
      const error: any = new Error('falhou');
      error.status = 500;

      interceptor.intercept(buildContext(request), buildCallHandler(throwError(() => error))).subscribe({
        error: () => {
          expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ response: error.message }));
          done();
        },
      });
    });

    it('loga o erro mesmo com salvarSucesso false', (done) => {
      mockLogCustom({ salvarSucesso: false });
      const request = { method: 'POST', path: '/x' };
      const error: any = new Error('falhou');
      error.status = 500;

      interceptor.intercept(buildContext(request), buildCallHandler(throwError(() => error))).subscribe({
        error: () => {
          expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ response: error.message }));
          done();
        },
      });
    });
  });
});
