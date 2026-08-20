/**
 * Retorna uma cópia de `value` com o valor dos campos indicados em `paths` substituído por `mask`.
 * Diferente de `removeFields`, o campo continua presente no log (só o valor é ocultado).
 * Cada path é um caminho separado por ponto (ex.: `'body.password'`).
 *
 * Nunca lança: se `value` não puder ser clonado (ex.: referência circular), retorna `value`
 * original sem redação, para nunca quebrar o fluxo de log por causa disso.
 */
export function redactFields<T>(value: T, paths?: string[], mask = '***'): T {
  if (value == null || !paths || paths.length === 0) {
    return value;
  }

  let clone: T;
  try {
    clone = JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }

  for (const path of paths) {
    redactFieldByPath(clone, path.split('.'), mask);
  }

  return clone;
}

function redactFieldByPath(target: any, segments: string[], mask: string): void {
  if (target == null || typeof target !== 'object') {
    return;
  }

  const [head, ...rest] = segments;
  if (rest.length === 0) {
    if (head in target) {
      target[head] = mask;
    }
    return;
  }

  redactFieldByPath(target[head], rest, mask);
}
