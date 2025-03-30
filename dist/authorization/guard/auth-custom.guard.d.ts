import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthServerService } from '../../auth-server/auth-server.interface';
import { AuthorizationOption } from 'src/options.dto';
export declare class AuthCustomGuard implements CanActivate {
    protected authorizationOption: AuthorizationOption;
    protected readonly reflector: Reflector;
    protected authServerService: AuthServerService;
    protected logger: Logger;
    constructor(authorizationOption: AuthorizationOption, reflector: Reflector, authServerService: AuthServerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    protected extractJwt(headers: {
        [key: string]: string;
    }): string;
    protected parseToken(token: string, addUser: any): string;
}
