import { SetMetadata } from '@nestjs/common';
import { AgenciaLocation, RoleMatchingMode } from './roles.enum';

export const META_ROLES_CUSTOM = 'MetaRolesCustom';

/**
 * Interface para as opções do decorador de roles customizadas.
 */
export interface RoleCustomDecoratorOptionsInterface {
  /**
   * As roles a serem verificadas na aplicação/cliente. Prefixe roles de nível de realm com "realm:" (ex.: realm:admin).
   */
  roles: string[];

  /**
   * Modo de verificação de roles. Padrão: {@link RoleMatchingMode.ALL}.
   */
  mode?: RoleMatchingMode;

  /**
   * Localização da agência. Padrão não definido.
   */
  agenciaLocation?: AgenciaLocation;

  /**
   * Nome do campo da agência. Padrão: "agencia".
   */
  agenciaFieldName?: string;

  /**
   * Função para obter o valor da agência.
   */
  getAgenciaValue?: (request: any) => string[];
}

/**
 * Decorador para definir roles customizadas em rotas.
 *
 * @param roleMetaData Metadados das roles customizadas.
 * @returns Decorador de metadado.
 */
export const RolesCustom = (roleMetaData: RoleCustomDecoratorOptionsInterface) =>
  SetMetadata(META_ROLES_CUSTOM, roleMetaData);
