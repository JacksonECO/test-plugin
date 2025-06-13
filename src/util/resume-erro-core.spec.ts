import { InternalServerErrorException } from '@nestjs/common';
import { resumeErrorCore } from './resume-erro-core';
import { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';

describe('resumeErrorCore', () => {
  describe('erro com tipos primitivos', () => {
    it('number', () => {
      const error = 123;
      const result = resumeErrorCore(error);
      expect(result).toStrictEqual('123');
    });
    it('string', () => {
      const error = '123';
      const result = resumeErrorCore(error);
      expect(result).toStrictEqual('123');
    });
    it('date', () => {
      const error = new Date();
      const result = resumeErrorCore(error);
      expect(result).toStrictEqual(error.toISOString());
    });
    it('date', () => {
      const error = BigInt(123);
      const result = resumeErrorCore(error);
      expect(result).toStrictEqual('123');
    });
    it('symbol', () => {
      const error = Symbol('my-symbol');
      const result = resumeErrorCore(error);
      expect(result).toStrictEqual('Symbol(my-symbol)');
    });

    it('objeto vazio', () => {
      const error = {};
      const result = resumeErrorCore(error);
      expect(result).toBe('{}');
    });

    it('undefined', () => {
      const error = undefined;
      const result = resumeErrorCore(error);
      expect(result).toBe('undefined');
    });
    it('null', () => {
      const error = null;
      const result = resumeErrorCore(error);
      expect(result).toBe('null');
    });
  });

  describe('erro com objeto', () => {
    it('com response com data e status', () => {
      const error = {
        response: {
          data: { message: 'Internal Server Error' },
          status: 500,
        },
      };
      const result = resumeErrorCore(error);
      expect(result).toBe('500 - {"message":"Internal Server Error"}');
    });
    it('com response com message e statusCode', () => {
      const error = {
        response: {
          message: 'Internal Server Error',
          statusCode: 500,
        },
      };
      const result = resumeErrorCore(error);
      expect(result).toBe('500 - "Internal Server Error"');
    });

    it('com message e status', () => {
      const error = { message: 'An error occurred', status: 500 };
      const result = resumeErrorCore(error);
      expect(result).toBe('500 - "An error occurred"');
    });

    it('com status', () => {
      const error = { statusCode: 500, desconhecido: 'Not Found' };
      const result = resumeErrorCore(error);
      expect(result).toBe('500 - {"statusCode":500,"desconhecido":"Not Found"}');
    });

    it('com campos desconhecidos', () => {
      const error = { desconhecido: 'Not Found' };
      const result = resumeErrorCore(error);
      expect(result).toBe('599 - {"desconhecido":"Not Found"}');
    });
  });

  describe('erro com throw (instância)', () => {
    it('Error', () => {
      const error = new Error('Erro lançado');
      error.stack = 'Stack trace aqui';
      const result = resumeErrorCore(error);
      expect(result).toBe('599 - "Erro lançado"');
    });

    it('InternalServerErrorException', () => {
      const error = new InternalServerErrorException('Erro lançado com stack', new Error('Stack trace aqui'));
      const result = resumeErrorCore(error);
      expect(result).toBe('500 - "Erro lançado com stack"');
    });

    it('AxiosError', () => {
      const error = new AxiosError(
        'Erro lançado com stack',
        '404',
        {
          headers: {} as AxiosRequestHeaders,
        },
        {
          data: { data: new Date() },
        },
        {
          status: 501,
          statusText: 'Internal Server Error',
          headers: {} as AxiosResponse['headers'],
          config: {} as AxiosResponse['config'],
          data: { message: 'Erro lançado com stack' },
        } as AxiosResponse,
      );
      const result = resumeErrorCore(error);
      expect(result).toBe('501 - {"message":"Erro lançado com stack"}');
    });
  });
});
