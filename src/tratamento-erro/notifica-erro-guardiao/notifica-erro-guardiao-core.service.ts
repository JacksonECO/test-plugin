import { Injectable, Inject, Logger } from '@nestjs/common';
import { GuardianCoreService } from '../../guardian/guardian-core.service';
import { CORE_TRATAMENTO_ERRO_LOG_REPOSITORY } from '../../constants';
import { ContextoErro } from '../interfaces/contexto-erro.interface';
import { ErroIdentificado } from '../interfaces/erro-identificado.interface';
import { TratamentoErroLogRepository } from '../interfaces/tratamento-erro-log.repository';

@Injectable()
export class NotificaErroGuardiaoCoreService {
  private logger = new Logger(NotificaErroGuardiaoCoreService.name);

  constructor(
    private guardianCoreService: GuardianCoreService,
    @Inject(CORE_TRATAMENTO_ERRO_LOG_REPOSITORY)
    private logRepository: TratamentoErroLogRepository,
  ) {}

  async notificarSeNecessario(erroIdentificado: ErroIdentificado, contexto?: ContextoErro): Promise<void> {
    if (erroIdentificado.tipo !== 'inesperado') {
      return;
    }
    await this.montarEEnviar(erroIdentificado.mensagem, erroIdentificado.erroOriginal, contexto);
  }

  async notificarSempre(mensagem: string, contexto?: ContextoErro): Promise<void> {
    await this.montarEEnviar(mensagem, null, contexto);
  }

  // Nunca deve lançar: a maioria dos chamadores dispara tratar()/notificar() dentro de um
  // catch sem "await" em alguns fluxos legados, então uma rejeição aqui vira unhandledRejection.
  private async montarEEnviar(mensagem: string, erroOriginal: any, contexto?: ContextoErro): Promise<void> {
    const erroDto = {
      falha: contexto?.falha ?? erroOriginal?.stack ?? mensagem,
      mensagem,
      agencia: contexto?.agencia ?? 'Sem informação',
      request: contexto?.request ?? {},
      ip: contexto?.ip,
    };

    try {
      await this.guardianCoreService.enviarErro(erroDto);
    } catch (error) {
      await this.registrarFalha(erroDto, error);
    }
  }

  private async registrarFalha(payload: unknown, error: any): Promise<void> {
    this.logger.error('Falha ao enviar mensagem para o Guardião', error?.stack ?? error);

    try {
      await this.logRepository.salvarRequisicao({
        tipo: 'SYSTEM',
        statusCode: 500,
        message: 'Falha ao enviar mensagem para o Guardião',
        request: payload,
        response: {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
        },
      });
    } catch (logError: any) {
      this.logger.error('Falha ao registrar log da falha do Guardião', logError?.stack ?? logError);
    }
  }
}
