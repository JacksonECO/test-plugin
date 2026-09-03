import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleCustomGuard } from './role-custom.guard';
import { AuthorizationOption } from 'src/options.dto';
import { RoleMatchingMode } from '../decorator/roles.enum';

function buildContext(request: any): ExecutionContext {
  return {
    getClass: () => class {},
    getHandler: () => function handler() {},
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({}),
    }),
  } as unknown as ExecutionContext;
}

describe('RoleCustomGuard', () => {
  let reflector: Reflector;

  function buildGuard(authorizationOption: Partial<AuthorizationOption>): RoleCustomGuard {
    return new RoleCustomGuard(authorizationOption as AuthorizationOption, reflector);
  }

  beforeEach(() => {
    reflector = new Reflector();
  });

  it('libera acesso para admin mesmo quando client.id não está configurado', async () => {
    const guard = buildGuard({ client: {} as any });
    jest.spyOn(reflector, 'getAll').mockReturnValue([{ roles: ['algum-recurso'], mode: RoleMatchingMode.ALL }]);
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const request = {
      user: { realm_access: { roles: ['ROLE_ADMIN'] } },
    };

    const result = await guard.canActivate(buildContext(request));

    expect(result).toBe(true);
  });

  it('nega acesso para usuário não-admin sem a role exigida quando client.id não está configurado', async () => {
    const guard = buildGuard({ client: {} as any });
    jest.spyOn(reflector, 'getAll').mockReturnValue([{ roles: ['algum-recurso'], mode: RoleMatchingMode.ALL }]);
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const request = {
      user: { realm_access: { roles: [] }, resource_access: {} },
    };

    const result = await guard.canActivate(buildContext(request));

    expect(result).toBe(false);
  });

  it('libera acesso para admin quando client.id está configurado normalmente', async () => {
    const guard = buildGuard({ client: { id: 'meu-client' } as any });
    jest.spyOn(reflector, 'getAll').mockReturnValue([{ roles: ['algum-recurso'], mode: RoleMatchingMode.ALL }]);
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const request = {
      user: { realm_access: { roles: ['ROLE_ADMIN'] } },
    };

    const result = await guard.canActivate(buildContext(request));

    expect(result).toBe(true);
  });
});
