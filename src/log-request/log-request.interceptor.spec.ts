import { Observable, of, throwError } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LogRequestInterceptor } from './log-request.interceptor';
import { LogCoreService } from 'src/log/log-core.service';
import { ContextCoreService } from 'src/context/context-core.service';
import { META_LOG_EXCLUDE, LogExcludeOptions } from './decorator/log-exclude.decorator';

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

  function mockLogExclude(options?: LogExcludeOptions) {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation((key) => (key === META_LOG_EXCLUDE ? options : undefined));
  }

  describe('sucesso', () => {
    it('loga request e response normalmente quando não há LogExclude', (done) => {
      mockLogExclude(undefined);
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

    it('remove campos do request quando requestFields é configurado', (done) => {
      mockLogExclude({ requestFields: ['body.password'] });
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

    it('remove campos do response quando responseFields é configurado', (done) => {
      mockLogExclude({ responseFields: ['token'] });
      const request = { method: 'GET', path: '/x' };

      interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc', nome: 'x' }))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ response: { nome: 'x' } }));
        done();
      });
    });

    it('redact campos do request quando requestFieldsRedact é configurado', (done) => {
      mockLogExclude({ requestFieldsRedact: ['body.password'] });
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

    it('redact campos do response quando responseFieldsRedact é configurado', (done) => {
      mockLogExclude({ responseFieldsRedact: ['token'] });
      const request = { method: 'GET', path: '/x' };

      interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc', nome: 'x' }))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(
          expect.objectContaining({ response: { token: '***', nome: 'x' } }),
        );
        done();
      });
    });

    it('não loga o request inteiro quando excludeRequest é true', (done) => {
      mockLogExclude({ excludeRequest: true });
      const request = { method: 'POST', path: '/x', body: { password: 'segredo' } };

      interceptor.intercept(buildContext(request), buildCallHandler(of({}))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ request: undefined }));
        done();
      });
    });

    it('não loga o response inteiro quando excludeResponse é true', (done) => {
      mockLogExclude({ excludeResponse: true });
      const request = { method: 'GET', path: '/x' };

      interceptor.intercept(buildContext(request), buildCallHandler(of({ token: 'abc' }))).subscribe(() => {
        expect(logService.salvarRequest).toHaveBeenCalledWith(expect.objectContaining({ response: undefined }));
        done();
      });
    });
  });

  describe('erro', () => {
    it('remove campos do request também no fluxo de erro', (done) => {
      mockLogExclude({ requestFields: ['body.password'] });
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
      mockLogExclude(undefined);
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
  });
});
