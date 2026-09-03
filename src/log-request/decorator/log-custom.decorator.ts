import { SetMetadata } from '@nestjs/common';

export const META_LOG_CUSTOM = 'MetaLogCustom';

/**
 * Opções de customização do log de requisição, lidas tanto pelo `LogRequestInterceptor`
 * (log persistido no Mongo) quanto pelo `LogConsoleInterceptor` (log no console).
 */
export interface LogCustomOptions {
  /** Tipo do log, usado para filtros. Persistido só pelo `LogRequestInterceptor` (Mongo). */
  tipo?: string;

  /** Descrição do endpoint. Persistida só pelo `LogRequestInterceptor` (Mongo), substitui a mensagem padrão (`method: url`). */
  mensagem?: string;

  /**
   * Se `false`, não loga esta rota quando a requisição for bem-sucedida (status 2xx) — nem request,
   * nem response: não persiste no Mongo e não imprime o `End Request` no console. Em caso de erro,
   * o log é sempre feito.
   * @default `true`
   */
  salvarSucesso?: boolean;

  /**
   * Se `false`, não persiste no Mongo o response desta rota quando a requisição for bem-sucedida
   * (status 2xx), mas mantém o log de request/erro normalmente. Diferente de `excluirResponse`, que
   * remove o response mesmo em caso de erro e também do console. Útil para rotas cujo response de
   * sucesso é grande ou sensível (ex.: decodificação de QRCode).
   * Ignorado se `excluirResponse` for `true` ou `salvarSucesso` for `false`.
   * @default `true`
   */
  salvarResponseSucesso?: boolean;

  /**
   * Se `true`, não loga o request (body/params/query) desta rota.
   * @default `false`
   */
  excluirRequest?: boolean;

  /**
   * Se `true`, não loga o response desta rota.
   * @default `false`
   */
  excluirResponse?: boolean;

  /**
   * Campos a remover do request antes de logar, por caminho separado por ponto
   * (ex.: `'body.senha'`, `'body.token'`). Ignorado se `excluirRequest` for `true`.
   */
  excluirCampoRequest?: string[];

  /**
   * Campos a remover do response antes de logar, por caminho separado por ponto
   * (ex.: `'token'`, `'usuario.senha'`). Ignorado se `excluirResponse` for `true`.
   */
  excluirCampoResponse?: string[];

  /**
   * Campos do request cujo valor deve ser substituído por uma máscara (ex.: `'***'`) antes de logar,
   * mantendo o campo presente no log. Diferente de `excluirCampoRequest`, que remove o campo por
   * completo. Ignorado se `excluirRequest` for `true`.
   */
  mascararCampoRequest?: string[];

  /**
   * Campos do response cujo valor deve ser substituído por uma máscara antes de logar, mantendo
   * o campo presente no log. Diferente de `excluirCampoResponse`, que remove o campo por completo.
   * Ignorado se `excluirResponse` for `true`.
   */
  mascararCampoResponse?: string[];
}

/**
 * Decorador que customiza quais dados de uma rota devem ser removidos/mascarados do log de
 * requisição (Mongo e console), e se o log de sucesso (request/response) deve ser persistido.
 *
 * @param options Opções de customização do log.
 * @returns Decorador de metadado.
 */
export const LogCustom = (options: LogCustomOptions) => SetMetadata(META_LOG_CUSTOM, options);
