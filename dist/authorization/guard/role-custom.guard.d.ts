import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationOption } from 'src/options.dto';
export declare class RoleCustomGuard implements CanActivate {
    protected authorizationOption: AuthorizationOption;
    private readonly reflector;
    protected logger: Logger;
    constructor(authorizationOption: AuthorizationOption, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private hasRole;
    private hasRealmRole;
    private hasApplicationRoleAgencia;
    private getClients;
    private getClientsWithRole;
    private addAgenciaRequest;
}
