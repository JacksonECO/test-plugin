import { redactFields } from './redact-fields';

describe('redactFields', () => {
  it('substitui o valor de um campo de topo pela máscara padrão', () => {
    const result = redactFields({ token: 'abc', nome: 'x' }, ['token']);

    expect(result).toEqual({ token: '***', nome: 'x' });
  });

  it('substitui o valor de um campo aninhado por dot-path', () => {
    const result = redactFields({ body: { password: 'segredo', username: 'x' } }, ['body.password']);

    expect(result).toEqual({ body: { password: '***', username: 'x' } });
  });

  it('aceita uma máscara customizada', () => {
    const result = redactFields({ token: 'abc' }, ['token'], '[REDACTED]');

    expect(result).toEqual({ token: '[REDACTED]' });
  });

  it('não cria o campo se ele não existir', () => {
    const result = redactFields({ nome: 'x' }, ['token']);

    expect(result).toEqual({ nome: 'x' });
  });

  it('não muta o objeto original', () => {
    const original = { body: { password: 'segredo' } };

    redactFields(original, ['body.password']);

    expect(original).toEqual({ body: { password: 'segredo' } });
  });

  it('não lança quando o caminho não existe', () => {
    expect(() => redactFields({ a: 1 }, ['b.c.d'])).not.toThrow();
  });

  it('retorna o valor original quando paths não é fornecido', () => {
    const value = { a: 1 };

    expect(redactFields(value)).toBe(value);
  });

  it('nunca lança mesmo com referência circular: retorna o valor original', () => {
    const circular: any = { a: 1 };
    circular.self = circular;

    expect(() => redactFields(circular, ['a'])).not.toThrow();
    expect(redactFields(circular, ['a'])).toBe(circular);
  });
});
