import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_UNPROTECTED, META_UNPROTECTED_AUTH } from '../decorator/authorization.decorator';
import { RoleMatchingMode, RoleMerge } from '../decorator/roles.enum';
import { META_ROLES_CUSTOM, RoleCustomDecoratorOptionsInterface } from '../decorator/roles.decorator';
import { CORE_AUTHORIZATION_OPTION } from '../../constants';
import { AuthorizationOption } from 'src/options.dto';


@Injectable()
export class RoleCustomGuard implements CanActivate {
  protected logger: Logger = new Logger(RoleCustomGuard.name + 'Plugin');

  constructor(
    @Inject(CORE_AUTHORIZATION_OPTION) protected authorizationOption: AuthorizationOption,
    private readonly reflector: Reflector,
  ) { }

  /**
   * Método principal que verifica se o usuário tem permissão para acessar o recurso.
   * @param context Contexto de execução do NestJS.
   * @returns Retorna `true` se o acesso for permitido, caso contrário `false`.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isUnprotected = this.reflector.getAllAndOverride<boolean>(
      META_UNPROTECTED,
      [context.getClass(), context.getHandler()],
    );

    const isUnprotectedAuth = this.reflector.getAllAndOverride<boolean>(META_UNPROTECTED_AUTH, [
      context.getClass(), context.getHandler(),
    ]);

    if (isUnprotected || isUnprotectedAuth) {
      return true;
    }

    const roleMerge = RoleMerge.ALL;
    const rolesMetaDatas: RoleCustomDecoratorOptionsInterface[] = [];

    if (roleMerge == RoleMerge.ALL) {
      const mergedRoleMetaData = this.reflector.getAll<
        RoleCustomDecoratorOptionsInterface[]
      >(META_ROLES_CUSTOM, [context.getClass(), context.getHandler()]);

      if (mergedRoleMetaData) {
        if (Array.isArray(mergedRoleMetaData)) {
          rolesMetaDatas.push(
            ...mergedRoleMetaData.filter((e) => (e ? true : false)),
          );
        } else {
          rolesMetaDatas.push(mergedRoleMetaData);
        }
      }
    } else if (roleMerge == RoleMerge.OVERRIDE) {
      const roleMetaData =
        this.reflector.getAllAndOverride<RoleCustomDecoratorOptionsInterface>(
          META_ROLES_CUSTOM,
          [context.getClass(), context.getHandler()],
        );

      if (roleMetaData) {
        rolesMetaDatas.push(roleMetaData);
      }
    } else {
      throw Error(`Tipo de mesclagem de roles desconhecido: ${roleMerge}`);
    }

    // Extrai a requisição HTTP
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    // Se não for uma requisição HTTP, ignora este guard
    if (!request) {
      return true;
    }

    const { user } = request;
    if (!user) {
      // Nenhum token de acesso encontrado, o AuthGuard deveria ter anexado o token necessário
      this.logger.warn(
        'Nenhum token de acesso encontrado na requisição. O AuthCustomGuard precisa estar configurado para anexar o token de acesso ao request.',
      );
      return false;
    }

    const combinedRoles = rolesMetaDatas.flatMap((x) => x.roles);
    if (combinedRoles.length === 0) {
      return true;
    }

    // Usa o modo de correspondência do primeiro item
    const roleMetaData = rolesMetaDatas[rolesMetaDatas.length - 1];
    const roleMatchingMode = roleMetaData.mode
      ? roleMetaData.mode
      : RoleMatchingMode.ALL;

    // console log com todas as roles do usuário
    // this.logger.verbose(
    //   `Roles (${roleMatchingMode}): ${JSON.stringify(combinedRoles)}`,
    // );

    // Verifica se o usuário possui as roles necessárias
    const granted =
      roleMatchingMode === RoleMatchingMode.ANY
        ? combinedRoles.some((role) => this.hasRole(user, role))
        : combinedRoles.every((role) => this.hasRole(user, role));

    if (!granted) {
      this.logger.verbose(`Acesso negado devido a roles incompatíveis: ${JSON.stringify(combinedRoles)}`);
      return false;
    }

    if (!roleMetaData.agenciaLocation && !roleMetaData.getAgenciaValue) {
      return true;
    }

    this.addAgenciaRequest(request, user, roleMetaData);

    return true;
  }

  /**
   * Verifica se o usuário possui uma role específica.
   * @param user Usuário autenticado.
   * @param role Role a ser verificada.
   * @returns Retorna `true` se o usuário possuir a role, caso contrário `false`.
   */
  private hasRole(user: any, role: string) {
    if (!this.authorizationOption.client.id) {
      return false;
    }

    // Admins possuem todas as roles
    if (this.hasRealmRole(user, 'ROLE_ADMIN')) {
      return true;
    }

    const parts = role.split(':');
    if (parts.length === 1) {
      return this.getClientsWithRole(user, parts[0]).length > 0;
    }

    if (parts[0] === 'realm') {
      return this.hasRealmRole(user, parts[1]);
    }

    return this.hasApplicationRoleAgencia(user, parts[0], parts[1]);
  }

  /**
   * Verifica se o usuário possui uma role no nível do realm.
   * @param user Usuário autenticado.
   * @param roleName Nome da role.
   * @returns Retorna `true` se o usuário possuir a role, caso contrário `false`.
   */
  private hasRealmRole(user: any, roleName: string) {
    if (!user.realm_access || !user.realm_access.roles) {
      return false;
    }

    return (
      user.realm_access.roles.find((role: string) => role === roleName) !==
      undefined
    );
  }

  /**
   * Verifica se o usuário possui uma role específica em uma aplicação/cliente.
   * @param user Usuário autenticado.
   * @param clientId ID do cliente.
   * @param roleName Nome da role.
   * @returns Retorna `true` se o usuário possuir a role, caso contrário `false`.
   */
  private hasApplicationRoleAgencia(
    user: any,
    clientId: string,
    roleName: string,
  ) {
    if (!user.resource_access) {
      return false;
    }

    const appRoles = user.resource_access[clientId];
    if (!appRoles) {
      return false;
    }

    return (
      appRoles.roles.find((role: string) => role === roleName) !== undefined
    );
  }

  /**
   * Obtém os clientes/agências associados ao usuário.
   * @param user Usuário autenticado.
   * @returns Lista de clientes/agências.
   */
  private getClients(user: any) {
    if (!user?.resource_access) {
      return [];
    }

    return Object.keys(user.resource_access)
      .filter((cliente) => cliente.startsWith('agencia_'))
      .map((cliente) => cliente.split('_')[1]);
  }

  /**
   * Obtém os clientes/agências associados ao usuário que possuem uma role específica.
   * @param user Usuário autenticado.
   * @param role Role a ser verificada.
   * @returns Lista de clientes/agências com a role.
   */
  private getClientsWithRole(user: any, role: string): string[] {
    if (this.hasRealmRole(user, 'ROLE_ADMIN')) {
      return this.getClients(user);
    }

    return this.getClients(user).filter((cliente) => {
      return user.resource_access[`agencia_${cliente}`].roles.includes(role);
    });
  }

  /**
   * Adiciona informações de agência à requisição com base nas roles do usuário.
   * @param request Requisição HTTP.
   * @param user Usuário autenticado.
   * @param roleMetaData Metadados da role.
   */
  private addAgenciaRequest(
    request: any,
    user: any,
    roleMetaData: RoleCustomDecoratorOptionsInterface,
  ): void {
    roleMetaData.agenciaFieldName = roleMetaData.agenciaFieldName || 'agencia';

    const agencias = this.getClientsWithRole(user, roleMetaData.roles[0]);
    if (agencias.length === 0) {
      // Validação de role já feita anteriormente, condição não deveria ser alcançada
      this.logger.verbose(
        `Usuário sem autorização: Usuário não tem acesso ao recurso: ${roleMetaData.roles[0]}`,
      );
      throw new ForbiddenException();
    }

    if (roleMetaData.getAgenciaValue) {
      const agenciasRequest = roleMetaData.getAgenciaValue(request);

      for (const agencia of agenciasRequest) {
        if (!agencias.includes(agencia)) {
          this.logger.verbose(`Usuário sem autorização ao recurso ${roleMetaData.roles[0]} da agência ${agencia}`);
          throw new ForbiddenException();
        }
      }
      return;
    }

    let agenciasRequest: string | string[] = null;
    // if (roleMetaData.agenciaLocation === 'param') {
    //   agenciasRequest = request.params[roleMetaData.agenciaFieldName];
    // } else
    if (roleMetaData.agenciaLocation === 'query') {
      agenciasRequest = request.query?.[roleMetaData.agenciaFieldName];
    } else if (roleMetaData.agenciaLocation === 'body') {
      agenciasRequest = request.body?.[roleMetaData.agenciaFieldName];
    }
    if (!agenciasRequest) {
      agenciasRequest = [];
    } else if (!Array.isArray(agenciasRequest)) {
      agenciasRequest = [agenciasRequest];
    }

    if (agenciasRequest.length === 0) {
      // if (roleMetaData.agenciaLocation === 'param') {
      //   request.params[roleMetaData.agenciaFieldName] = agencias[0];
      // } else
      if (roleMetaData.agenciaLocation === 'query') {
        // Sobrescreve request.query com o novo objeto mutável
        const updatedQuery = { ...request.query };
        updatedQuery[roleMetaData.agenciaFieldName] = agencias;
        Object.defineProperty(request, 'query', {
          value: updatedQuery,
          writable: true,
          configurable: true,
        });
      } else if (roleMetaData.agenciaLocation === 'body') {
        if (!request.body) {
          request.body = {};
        }
        request.body[roleMetaData.agenciaFieldName] = agencias;
      }
    } else {
      agenciasRequest = agenciasRequest.map((agencia) =>
        agencia.toString().padStart(4, '0'),
      );
      for (const agencia of agenciasRequest) {
        if (!agencias.includes(agencia)) {
          this.logger.verbose(`Usuário sem autorização ao recurso ${roleMetaData.roles[0]} da agência ${agencia}`);
          throw new ForbiddenException();
        }
      }
    }
  }
}
