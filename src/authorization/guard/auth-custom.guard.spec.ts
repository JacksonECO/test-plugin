import { Test, TestingModule } from '@nestjs/testing';
import { AuthCustomGuard } from './auth-custom.guard';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthServerService } from '../../auth-server/auth-server.interface';
import { PluginCoreModule } from 'src/plugin-core.module';
import { mockPluginCoreOption } from 'test/mocks/options.dto.mock';
import { AuthServerCoreModule } from 'src/auth-server/auth-server.module';

describe('AuthCustomGuard', () => {
  const tokenValid =
    'Bearer header.eyJpc3MiOiJ0ZXN0ZSIsImlhdCI6MTc0MzM3NzE1NSwiZXhwIjoyNTMyMjk1NTU1LCJhdWQiOiJ3d3cudGVzdC5wbHVnaW4uY29tIiwic3ViIjoiZW1haWxAZXhhbXBsZS5jb20iLCJmdWxsTmFtZSI6IkpvaG5ueSBSb2NrZXQiLCJlbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJyb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.signature';
  let guard: AuthCustomGuard;
  let reflector: Reflector;
  let authServerService: AuthServerService;

  const mockReflector = {
    getAllAndOverride: jest.fn().mockReturnValue(false),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn(),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PluginCoreModule.forRoot(mockPluginCoreOption()), AuthServerCoreModule],
      providers: [AuthCustomGuard, { provide: Reflector, useValue: mockReflector }],
    }).compile();

    guard = module.get<AuthCustomGuard>(AuthCustomGuard);
    reflector = module.get<Reflector>(Reflector);
    authServerService = module.get<AuthServerService>(AuthServerService);

    jest.spyOn(authServerService, 'validateToken').mockImplementation((token: string) => {
      if (token === 'invalid.jwt.token') {
        return Promise.resolve([false, {}]);
      }
      return Promise.resolve([true, { email: 'user@example.com' }]);
    });
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue({ headers: { authorization: tokenValid } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(guard).toBeDefined();
  });

  it('deve permitir acesso a rotas não protegidas', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);
    jest.spyOn(mockExecutionContext.switchToHttp(), 'getRequest').mockReturnValue({ headers: {} });

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('deve permitir acesso a rotas com user opcional não informado', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true);
    jest.spyOn(mockExecutionContext.switchToHttp(), 'getRequest').mockReturnValue({ headers: {} });

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('deve permitir acesso a rotas com user opcional, sendo informado deve ser extraído suas informações', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true);

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
    expect(authServerService.validateToken).toHaveBeenCalledTimes(1);

    const request = mockExecutionContext.switchToHttp().getRequest();
    expect(request.user).toBeTruthy();
    expect(request.user.sub).toBeTruthy();
  });

  it('deve permitir acesso a rotas com user opcional, mesmo com JWT inválido', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true);
    jest.spyOn(mockExecutionContext.switchToHttp(), 'getRequest').mockReturnValue({
      headers: { authorization: 'Bearer invalid.jwt.token' },
    });

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
    expect(authServerService.validateToken).toHaveBeenCalledTimes(1);
  });

  it('deve lançar UnauthorizedException se o JWT estiver ausente em rotas protegidas', async () => {
    jest.spyOn(mockExecutionContext.switchToHttp(), 'getRequest').mockReturnValue({ headers: {} });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException se o JWT for inválido', async () => {
    jest.spyOn(mockExecutionContext.switchToHttp(), 'getRequest').mockReturnValue({
      headers: { authorization: 'Bearer invalid.jwt.token' },
    });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
  });

  it('deve permitir acesso e anexar o usuário ao request se o JWT for válido', async () => {
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
    expect(authServerService.validateToken).toHaveBeenCalledTimes(1);
  });

  it('deve retornar null se extractJwt for chamado com cabeçalhos inválidos', () => {
    const result = guard['extractJwt']({});
    expect(result).toBeNull();
  });

  it('deve retornar null se extractJwt for chamado com cabeçalhos não definidos', () => {
    const result = guard['extractJwt'](undefined);
    expect(result).toBeNull();
  });

  it('deve retornar null se extractJwt for chamado com token não-Bearer', () => {
    const result = guard['extractJwt']({ authorization: 'Basic token' });
    expect(result).toBeNull();
  });

  it('deve retornar null se extractJwt for chamado com token inválido', () => {
    const result = guard['extractJwt']({ authorization: 'invalid' });
    expect(result).toBeNull();
  });

  it('deve fazer o parse do token corretamente em parseToken', () => {
    const token = 'header.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20ifQ.signature';
    const addUser = { role: 'admin' };
    const result = guard['parseToken'](token, addUser);

    expect(result).toEqual(expect.objectContaining({ email: 'user@example.com', role: 'admin' }));
  });
});
