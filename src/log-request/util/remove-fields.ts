/**
 * Retorna uma cópia de `value` com os campos indicados em `paths` removidos.
 * Cada path é um caminho separado por ponto (ex.: `'body.password'`).
 *
 * Nunca lança: se `value` não puder ser clonado (ex.: referência circular), retorna `value`
 * original sem remoção, para nunca quebrar o fluxo de log por causa disso.
 */
export function removeFields<T>(value: T, paths?: string[]): T {
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
    removeFieldByPath(clone, path.split('.'));
  }

  return clone;
}

function removeFieldByPath(target: any, segments: string[]): void {
  if (target == null || typeof target !== 'object') {
    return;
  }

  const [head, ...rest] = segments;
  if (rest.length === 0) {
    delete target[head];
    return;
  }

  removeFieldByPath(target[head], rest);
}
