import type { Mocked } from 'vitest';
import { InternalServerErrorException } from '@nestjs/common';
import { TratamentoErroCoreService } from './tratamento-erro-core.service';
import { IdentificaErroCoreService } from './identifica-erro/identifica-erro-core.service';
import { NotificaErroGuardiaoCoreService } from './notifica-erro-guardiao/notifica-erro-guardiao-core.service';
import { RegistraErroMongoCoreService } from './registra-erro-mongo/registra-erro-mongo-core.service';
import { TratarErrosCoreService } from './tratar-erros/tratar-erros-core.service';

describe('TratamentoErroCoreService', () => {
  let service: TratamentoErroCoreService;
  let identificaErroService: Mocked<IdentificaErroCoreService>;
  let notificaErroGuardiaoService: Mocked<NotificaErroGuardiaoCoreService>;
  let registraErroMongoService: Mocked<RegistraErroMongoCoreService>;
  let tratarErros: Mocked<TratarErrosCoreService>;

  const erroIdentificadoBase = {
    mensagem: 'falha de conexão',
    statusCode: 500,
    tipo: 'inesperado' as const,
    erroOriginal: new Error('falha de conexão'),
  };

  beforeEach(() => {
    identificaErroService = { identificar: vi.fn().mockReturnValue(erroIdentificadoBase) } as any;
    notificaErroGuardiaoService = {
      notificarSeNecessario: vi.fn(),
      notificarSempre: vi.fn(),
    } as any;
    registraErroMongoService = { registrar: vi.fn(), registrarSempre: vi.fn() } as any;
    tratarErros = {
      lancar: vi.fn().mockImplementation(() => {
        throw new InternalServerErrorException('falha de conexão');
      }),
    } as any;

    service = new TratamentoErroCoreService(
      identificaErroService,
      notificaErroGuardiaoService,
      registraErroMongoService,
      tratarErros,
    );
  });

  describe('tratar', () => {
    it('identifica, registra, notifica e lança, nessa ordem', async () => {
      const chamadas: string[] = [];
      registraErroMongoService.registrar.mockImplementation(async () => {
        chamadas.push('registrar');
      });
      notificaErroGuardiaoService.notificarSeNecessario.mockImplementation(async () => {
        chamadas.push('notificar');
      });
      tratarErros.lancar.mockImplementation(() => {
        chamadas.push('lancar');
        throw new InternalServerErrorException('falha de conexão');
      });

      await expect(service.tratar(new Error('falha de conexão'))).rejects.toThrow(InternalServerErrorException);

      expect(chamadas).toEqual(['registrar', 'notificar', 'lancar']);
    });

    it('sobrescreve a mensagem do erro identificado com contexto.mensagem', async () => {
      tratarErros.lancar.mockImplementation(() => {
        throw new InternalServerErrorException('mensagem custom');
      });

      await expect(service.tratar(new Error('x'), { mensagem: 'mensagem custom' })).rejects.toThrow('mensagem custom');

      expect(registraErroMongoService.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ mensagem: 'mensagem custom' }),
        { mensagem: 'mensagem custom' },
      );
    });

    it('não deixa falha no registro do Mongo bloquear a notificação nem trocar o erro lançado', async () => {
      registraErroMongoService.registrar.mockRejectedValue(new Error('mongo indisponível'));
      tratarErros.lancar.mockImplementation(() => {
        throw new InternalServerErrorException('falha de conexão');
      });

      await expect(service.tratar(new Error('falha de conexão'))).rejects.toThrow(InternalServerErrorException);

      expect(notificaErroGuardiaoService.notificarSeNecessario).toHaveBeenCalled();
      expect(tratarErros.lancar).toHaveBeenCalledWith(erroIdentificadoBase);
    });
  });

  describe('notificar', () => {
    it('registra e notifica sem lançar', async () => {
      await service.notificar(new Error('falha de conexão'));

      expect(registraErroMongoService.registrar).toHaveBeenCalled();
      expect(notificaErroGuardiaoService.notificarSeNecessario).toHaveBeenCalled();
      expect(tratarErros.lancar).not.toHaveBeenCalled();
    });

    it('não deixa falha no registro do Mongo bloquear a notificação nem rejeitar com o erro do Mongo', async () => {
      registraErroMongoService.registrar.mockRejectedValue(new Error('mongo indisponível'));

      await expect(service.notificar(new Error('falha de conexão'))).resolves.toBeUndefined();

      expect(notificaErroGuardiaoService.notificarSeNecessario).toHaveBeenCalled();
    });
  });

  describe('proteção contra duplicidade em cadeia de catches', () => {
    beforeEach(() => {
      // Nos testes acima o mock de identificar sempre devolve o mesmo erroOriginal fixo;
      // aqui precisamos que reflita o erro realmente recebido, como o serviço real faz,
      // pra simular corretamente uma cadeia de catches passando o mesmo objeto adiante.
      identificaErroService.identificar.mockImplementation((error: unknown) => ({
        ...erroIdentificadoBase,
        erroOriginal: error,
      }));
    });

    it('tratar() não registra nem notifica de novo quando chamado outra vez com o erro já relançado por uma camada anterior', async () => {
      tratarErros.lancar.mockImplementation(() => {
        throw new InternalServerErrorException('falha de conexão');
      });

      let erroRelancado: unknown;
      try {
        await service.tratar(new Error('falha de conexão'));
      } catch (e) {
        erroRelancado = e;
      }
      registraErroMongoService.registrar.mockClear();
      notificaErroGuardiaoService.notificarSeNecessario.mockClear();

      await expect(service.tratar(erroRelancado)).rejects.toThrow(InternalServerErrorException);

      expect(registraErroMongoService.registrar).not.toHaveBeenCalled();
      expect(notificaErroGuardiaoService.notificarSeNecessario).not.toHaveBeenCalled();
      expect(tratarErros.lancar).toHaveBeenCalledTimes(2);
    });

    it('notificar() não registra nem notifica de novo quando chamado outra vez com o mesmo erro já tratado', async () => {
      const erro = new Error('falha de conexão');

      await service.notificar(erro);
      registraErroMongoService.registrar.mockClear();
      notificaErroGuardiaoService.notificarSeNecessario.mockClear();

      await service.notificar(erro);

      expect(registraErroMongoService.registrar).not.toHaveBeenCalled();
      expect(notificaErroGuardiaoService.notificarSeNecessario).not.toHaveBeenCalled();
    });

    it('cadeia mista: erro relançado por tratar() numa camada não duplica ao chegar em notificar() de outra camada', async () => {
      tratarErros.lancar.mockImplementation(() => {
        throw new InternalServerErrorException('falha de conexão');
      });

      let erroRelancado: unknown;
      try {
        await service.tratar(new Error('falha de conexão'));
      } catch (e) {
        erroRelancado = e;
      }
      registraErroMongoService.registrar.mockClear();
      notificaErroGuardiaoService.notificarSeNecessario.mockClear();

      await service.notificar(erroRelancado);

      expect(registraErroMongoService.registrar).not.toHaveBeenCalled();
      expect(notificaErroGuardiaoService.notificarSeNecessario).not.toHaveBeenCalled();
    });

    it('erros diferentes continuam sendo registrados e notificados normalmente (marca não vaza entre erros)', async () => {
      await service.notificar(new Error('erro 1'));
      await service.notificar(new Error('erro 2'));

      expect(registraErroMongoService.registrar).toHaveBeenCalledTimes(2);
      expect(notificaErroGuardiaoService.notificarSeNecessario).toHaveBeenCalledTimes(2);
    });
  });

  describe('notificarSempre', () => {
    it('registra e notifica sempre, sem identificar erro', async () => {
      await service.notificarSempre('aviso manual', { agencia: 'ag1' });

      expect(registraErroMongoService.registrarSempre).toHaveBeenCalledWith('aviso manual', { agencia: 'ag1' });
      expect(notificaErroGuardiaoService.notificarSempre).toHaveBeenCalledWith('aviso manual', { agencia: 'ag1' });
      expect(identificaErroService.identificar).not.toHaveBeenCalled();
    });

    it('não deixa falha no registro do Mongo bloquear a notificação nem rejeitar com o erro do Mongo', async () => {
      registraErroMongoService.registrarSempre.mockRejectedValue(new Error('mongo indisponível'));

      await expect(service.notificarSempre('aviso manual', { agencia: 'ag1' })).resolves.toBeUndefined();

      expect(notificaErroGuardiaoService.notificarSempre).toHaveBeenCalledWith('aviso manual', { agencia: 'ag1' });
    });
  });
});
