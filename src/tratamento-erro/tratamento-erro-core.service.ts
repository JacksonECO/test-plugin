import { Injectable, Logger } from '@nestjs/common';
import { IdentificaErroCoreService } from './identifica-erro/identifica-erro-core.service';
import { NotificaErroGuardiaoCoreService } from './notifica-erro-guardiao/notifica-erro-guardiao-core.service';
import { RegistraErroMongoCoreService } from './registra-erro-mongo/registra-erro-mongo-core.service';
import { TratarErrosCoreService } from './tratar-erros/tratar-erros-core.service';
import { ContextoErro } from './interfaces/contexto-erro.interface';
import { ErroIdentificado } from './interfaces/erro-identificado.interface';

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
    const erroIdentificado = this.identificarComContexto(error, contexto);
    await this.registrarComProtecao(erroIdentificado, contexto);
    await this.notificaErroGuardiaoService.notificarSeNecessario(erroIdentificado, contexto);
    this.tratarErros.lancar(erroIdentificado);
  }

  async notificar(error: unknown, contexto?: ContextoErro): Promise<void> {
    const erroIdentificado = this.identificarComContexto(error, contexto);
    await this.registrarComProtecao(erroIdentificado, contexto);
    await this.notificaErroGuardiaoService.notificarSeNecessario(erroIdentificado, contexto);
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
}
