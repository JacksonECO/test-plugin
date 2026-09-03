import { removeFields } from './remove-fields';

describe('removeFields', () => {
  it('remove um campo de topo', () => {
    const result = removeFields({ token: 'abc', nome: 'x' }, ['token']);

    expect(result).toEqual({ nome: 'x' });
  });

  it('remove um campo aninhado por dot-path', () => {
    const result = removeFields({ body: { password: 'segredo', username: 'x' } }, ['body.password']);

    expect(result).toEqual({ body: { username: 'x' } });
  });

  it('remove múltiplos campos', () => {
    const result = removeFields({ body: { password: 'a', token: 'b' }, query: { key: 'c' } }, [
      'body.password',
      'body.token',
      'query.key',
    ]);

    expect(result).toEqual({ body: {}, query: {} });
  });

  it('não muta o objeto original', () => {
    const original = { body: { password: 'segredo' } };

    removeFields(original, ['body.password']);

    expect(original).toEqual({ body: { password: 'segredo' } });
  });

  it('não lança quando o caminho não existe', () => {
    expect(() => removeFields({ a: 1 }, ['b.c.d'])).not.toThrow();
  });

  it('retorna o valor original quando paths não é fornecido', () => {
    const value = { a: 1 };

    expect(removeFields(value)).toBe(value);
  });

  it('retorna undefined/null sem lançar', () => {
    expect(removeFields(undefined, ['a'])).toBeUndefined();
    expect(removeFields(null, ['a'])).toBeNull();
  });

  it('nunca lança mesmo com referência circular: retorna o valor original', () => {
    const circular: any = { a: 1 };
    circular.self = circular;

    expect(() => removeFields(circular, ['a'])).not.toThrow();
    expect(removeFields(circular, ['a'])).toBe(circular);
  });
});
