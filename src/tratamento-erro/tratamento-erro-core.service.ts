import { Injectable, Logger } from '@nestjs/common';
import { IdentificaErroCoreService } from './identifica-erro/identifica-erro-core.service';
import { NotificaErroGuardiaoCoreService } from './notifica-erro-guardiao/notifica-erro-guardiao-core.service';
import { RegistraErroMongoCoreService } from './registra-erro-mongo/registra-erro-mongo-core.service';
import { TratarErrosCoreService } from './tratar-erros/tratar-erros-core.service';
import { ContextoErro } from './interfaces/contexto-erro.interface';
import { ErroIdentificado } from './interfaces/erro-identificado.interface';

/**
 * Marca (não-enumerável, não aparece em JSON.stringify/spread) que um erro já passou
 * por registro + notificação. Evita duplicar log/alerta quando o mesmo erro atravessa
 * várias camadas de catch que cada uma chama tratar()/notificar() e relança pro chamador
 * — sem isso, cada camada da cadeia notifica o Guardião e grava no Mongo de novo pro
 * mesmo erro original.
 */
const ERRO_JA_TRATADO = Symbol('erroJaTratado');

@Injectable()
export class TratamentoErroCoreService {
  private logger = new Logger(TratamentoErroCoreService.name);

  constructor(
    private identificaErroService: IdentificaErroCoreService,
    private notificaErroGuardiaoService: NotificaErroGuardiaoCoreService,
    private registraErroMongoService: RegistraErroMongoCoreService,
    private tratarErros: TratarErrosCoreService,
  ) {}

  async tratar(error: unknown, contexto?: ContextoErro): Promise<never> {
    const jaTratado = this.estaTratado(error);
    const erroIdentificado = this.identificarComContexto(error, contexto);
    if (!jaTratado) {
      await this.registrarComProtecao(erroIdentificado, contexto);
      await this.notificaErroGuardiaoService.notificarSeNecessario(erroIdentificado, contexto);
    }
    try {
      this.tratarErros.lancar(erroIdentificado);
    } catch (erroFinal) {
      // Marca o que de fato será relançado (pode ser um novo InternalServerErrorException,
      // não o erroOriginal) para que a próxima camada de catch, ao capturá-lo, saiba pular
      // registro/notificação e só relançar.
      this.marcarComoTratado(erroFinal);
      throw erroFinal;
    }
  }

  async notificar(error: unknown, contexto?: ContextoErro): Promise<void> {
    if (this.estaTratado(error)) {
      return;
    }
    const erroIdentificado = this.identificarComContexto(error, contexto);
    await this.registrarComProtecao(erroIdentificado, contexto);
    await this.notificaErroGuardiaoService.notificarSeNecessario(erroIdentificado, contexto);
    this.marcarComoTratado(erroIdentificado.erroOriginal);
  }

  async notificarSempre(mensagem: string, contexto?: ContextoErro): Promise<void> {
    await this.registrarSempreComProtecao(mensagem, contexto);
    await this.notificaErroGuardiaoService.notificarSempre(mensagem, contexto);
  }

  private async registrarComProtecao(erroIdentificado: ErroIdentificado, contexto?: ContextoErro): Promise<void> {
    try {
      await this.registraErroMongoService.registrar(erroIdentificado, contexto);
    } catch (error) {
      this.logger.error('Falha ao registrar erro no log', error?.stack ?? error);
    }
  }

  private async registrarSempreComProtecao(mensagem: string, contexto?: ContextoErro): Promise<void> {
    try {
      await this.registraErroMongoService.registrarSempre(mensagem, contexto);
    } catch (error) {
      this.logger.error('Falha ao registrar log', error?.stack ?? error);
    }
  }

  private identificarComContexto(error: unknown, contexto?: ContextoErro): ErroIdentificado {
    const erroIdentificado = this.identificaErroService.identificar(error);
    if (!contexto?.mensagem) {
      return erroIdentificado;
    }
    return { ...erroIdentificado, mensagem: contexto.mensagem };
  }

  private estaTratado(error: unknown): boolean {
    return typeof error === 'object' && error !== null && (error as any)[ERRO_JA_TRATADO] === true;
  }

  private marcarComoTratado(error: unknown): void {
    if (typeof error === 'object' && error !== null) {
      Object.defineProperty(error, ERRO_JA_TRATADO, { value: true, enumerable: false, configurable: true });
    }
  }
}
