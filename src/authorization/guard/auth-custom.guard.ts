import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_UNPROTECTED_AUTH, META_UNPROTECTED } from '../decorator/authorization.decorator';
import { AuthServerService } from '../../auth-server/auth-server.interface';
import { CORE_AUTHORIZATION_OPTION } from 'src/constants';
import { AuthorizationOption } from 'src/options.dto';

@Injectable()
export class AuthCustomGuard implements CanActivate {
  protected logger: Logger = new Logger(AuthCustomGuard.name + 'Plugin');
  constructor(
    @Inject(CORE_AUTHORIZATION_OPTION) protected authorizationOption: AuthorizationOption,
    protected readonly reflector: Reflector,
    protected authServerService: AuthServerService,
  ) {}

  /**
   * Verifica se a requisição pode ser ativada com base nas regras de autenticação.
   *
   * @param context Contexto de execução.
   * @returns `true` se a requisição for permitida, caso contrário lança uma exceção.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isUnprotected = this.reflector.getAllAndOverride<boolean>(META_UNPROTECTED, [
      context.getClass(),
      context.getHandler(),
    ]);
    // Se a rota for pública
    if (isUnprotected) {
      return true;
    }

    const isUnprotectedAuth = this.reflector.getAllAndOverride<boolean>(META_UNPROTECTED_AUTH, [
      context.getClass(),
      context.getHandler(),
    ]);

    // Obtém o contexto HTTP
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const jwt = this.extractJwt(request?.headers);
    const isJwtEmpty = jwt === null || jwt === undefined;

    // Se for uma rota pública com autenticação opcional e não houver JWT
    if (isJwtEmpty && isUnprotectedAuth) {
      this.logger.verbose('JWT não encontrado, mas como é opcional, foi permitido.');
      return true;
    }

    if (isJwtEmpty) {
      this.logger.verbose('JWT não encontrado, Unauthorized-401.');
      throw new UnauthorizedException();
    }

    const [isValidToken, dataAdd] = await this.authServerService.validateToken(jwt);
    if (isValidToken && dataAdd) {
      // Anexa as informações do usuário ao request
      request.user = this.parseToken(jwt, dataAdd);
      this.logger.verbose(`Usuário autenticado: ${request?.user?.email}`);
      return true;
    }

    if (isUnprotectedAuth) {
      this.logger.verbose('JWT inválido, mas como é opcional, foi permitido.');
      return true;
    }

    throw new UnauthorizedException();
  }

  /**
   * Extrai o JWT do cabeçalho da requisição.
   *
   * @param headers Cabeçalhos da requisição.
   * @returns O token JWT ou `null` se não encontrado.
   */
  protected extractJwt(headers: { [key: string]: string }) {
    if (!headers?.authorization) {
      return null;
    }

    const auth = headers.authorization.split(' ');

    // Apenas tokens do tipo Bearer são permitidos
    if (auth[0].toLowerCase() !== 'bearer') {
      this.logger.verbose(`Tipo de autenticação inválido.`);
      return null;
    }

    return auth[1];
  }

  /**
   * Faz o parse do token JWT e adiciona informações extras do usuário.
   *
   * @param token Token JWT.
   * @param addUser Informações adicionais do usuário.
   * @returns Objeto do usuário com informações do token e adicionais.
   */
  protected parseToken(token: string, addUser: any): string {
    const parts = token.split('.');
    const user = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    return {
      ...user,
      ...addUser,
    };
  }
}
