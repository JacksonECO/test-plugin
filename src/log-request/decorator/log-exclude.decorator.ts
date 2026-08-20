import { SetMetadata } from '@nestjs/common';

export const META_LOG_EXCLUDE = 'MetaLogExclude';

/**
 * Opções de exclusão de dados sensíveis do log de requisição (persistido pelo `LogRequestInterceptor`).
 */
export interface LogExcludeOptions {
  /**
   * Se `true`, não loga o request (body/params/query) desta rota.
   * @default `false`
   */
  excludeRequest?: boolean;

  /**
   * Se `true`, não loga o response desta rota.
   * @default `false`
   */
  excludeResponse?: boolean;

  /**
   * Campos a remover do request antes de logar, por caminho separado por ponto
   * (ex.: `'body.password'`, `'body.token'`). Ignorado se `excludeRequest` for `true`.
   */
  requestFields?: string[];

  /**
   * Campos a remover do response antes de logar, por caminho separado por ponto
   * (ex.: `'token'`, `'usuario.senha'`). Ignorado se `excludeResponse` for `true`.
   */
  responseFields?: string[];

  /**
   * Campos do request cujo valor deve ser substituído por uma máscara (ex.: `'***'`) antes de logar,
   * mantendo o campo presente no log. Diferente de `requestFields`, que remove o campo por completo.
   * Ignorado se `excludeRequest` for `true`.
   */
  requestFieldsRedact?: string[];

  /**
   * Campos do response cujo valor deve ser substituído por uma máscara antes de logar, mantendo
   * o campo presente no log. Diferente de `responseFields`, que remove o campo por completo.
   * Ignorado se `excludeResponse` for `true`.
   */
  responseFieldsRedact?: string[];
}

/**
 * Decorador que configura quais dados de uma rota devem ser removidos do log de requisição
 * persistido pelo `LogRequestInterceptor`, antes de salvar no Mongo.
 *
 * @param options Opções de exclusão de campos/objetos.
 * @returns Decorador de metadado.
 */
export const LogExclude = (options: LogExcludeOptions) => SetMetadata(META_LOG_EXCLUDE, options);
