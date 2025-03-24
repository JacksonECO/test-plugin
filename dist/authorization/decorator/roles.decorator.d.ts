import { AgenciaLocation, RoleMatchingMode } from './roles.enum';
export declare const META_ROLES_CUSTOM = "MetaRolesCustom";
export interface RoleCustomDecoratorOptionsInterface {
    roles: string[];
    mode?: RoleMatchingMode;
    agenciaLocation?: AgenciaLocation;
    agenciaFieldName?: string;
    getAgenciaValue?: (request: any) => string[];
}
export declare const RolesCustom: (roleMetaData: RoleCustomDecoratorOptionsInterface) => import("@nestjs/common").CustomDecorator<string>;
