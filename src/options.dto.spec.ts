import { AuthorizationOption, PluginCoreOption } from './options.dto';

describe('AuthorizationOption', () => {
  it('não lança quando nenhum input é passado', () => {
    expect(() => new AuthorizationOption()).not.toThrow();
  });

  it('não lança quando input é passado sem user/client', () => {
    expect(() => new AuthorizationOption({ authServerUrl: 'http://x' } as AuthorizationOption)).not.toThrow();
  });

  it('copia user/client do input quando fornecidos', () => {
    const option = new AuthorizationOption({
      authServerUrl: 'http://x',
      user: { username: 'user1', password: 'pass1' },
      client: { id: 'id1', secret: 'secret1', realm: 'realm1' },
    } as AuthorizationOption);

    expect(option.user).toEqual({ username: 'user1', password: 'pass1' });
    expect(option.client).toEqual({ id: 'id1', secret: 'secret1', realm: 'realm1' });
  });
});

describe('PluginCoreOption', () => {
  it('não lança quando authorization é omitido (caso real que quebrava o bootstrap de consumidores)', () => {
    expect(() => new PluginCoreOption({} as PluginCoreOption)).not.toThrow();
  });

  it('não lança quando nenhum input é passado', () => {
    expect(() => new PluginCoreOption()).not.toThrow();
  });
});
