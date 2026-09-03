
<p align="center">
  <a href="http://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="60" height="60"  alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord" /></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us" /></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter" /></a>
</p>



# Core Banking Plugin

## Descrição

Plugin desenvolvido para ser integrado em todos os micros serviços do Core Banking. Nele contem alguns módulos que deve estar em todos os serviços, como de autenticação e o de criação de logs;

## Instalação do plugin

Para instalar a ultima versão 

```bash
$ pnpm install git+ssh://git@bitbucket.org:usuario/repositorio.git
```

Para instalar usando um branch específica:

```bash
$ pnpm install git+ssh://git@bitbucket.org:usuario/repositorio.git#branch-nome
```


## Compilação

Sempre antes de utilizar o plugin deve sempre antes realizar um build, visto que o código a ser usando é o presente na pasta `dist`;

```bash
$ pnpm build
```

Por padrão é recomentado que sempre que criar novos módulos, services ou interfaces que vão ser importado no projeto final o mesmo deve estar sendo exportado pelo arquivo index.ts presente dentro da pasta `src`

## Rodando testes

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Módulos

### Root

Necessário para configurar todas as variáveis de ambiente do plugin.

Deve ser feito apenas uma vez de preferência no `AppModule`

```javascript
PluginCoreModule.forRoot({
  authorization: {
    authServerUrl: '<Url do Servidor (Core ou Keycloak)>',
    isCoreServiceAuth: '<Indica se a url do servidor é o core ou o Keycloak>',
    client: {
      id: '<Nome do Cliente>',
      secret: '<Credentials do Cliente usado>',
      realm: '<Nome do reino>',
    },
    user: {
      username: '<Usuário de serviço, se aplicável>',
      password: '<Senha do usuário de serviço, se aplicável>',
    },
  },
}),
```

Atenção: `client.id` precisa estar preenchido para que a validação de roles não-admin funcione (usuários com a role `realm:ROLE_ADMIN` sempre têm acesso irrestrito, independente de `client.id`).

### Autenticação e autorização das rotas

Para ser possível verificar se o usuário que esta acessando o sistema esta logado e que tenha todas as permissões necessárias deve realizar a importação `AuthorizationCoreModule`;

#### Tag

##### Rotas públicas ou privadas

Por padrão todas as rotas são protegidas, para deixar publica utiliza na rota a tag `@Public()`. Caso queira deixar a rota publica, mas caso seja passado o usuário ainda seja feita um tentativa de obter o usuário logado use a tag `@PublicAuth()`. Por fim caso queira forçar que a rota será obrigatório a autenticação utilize a tag `@Protected()`.

##### Bloqueio de rotas por roles

Atenção: Válido apenas se a rota não estiver pública. E se o usuário tiver a role `realm:ROLE_ADMIN` terá acesso irrestrito a aplicação.

```javascript
@RolesCustom({
  roles: ['ROLE_LISTAR'],
  mode: RoleMatchingMode.ALL;
  agenciaLocation: AgenciaLocation.QUERY,
  agenciaFieldName: 'agencia'
})
```

Em `roles` passe a lista de roles necessárias para acessar o recurso, sendo necessário que o usuário tenha todas. Caso queira que sera a rule `A` ou `B`, coloque ambas na lista e passa na propriedade `mode` com o valor `RoleMatchingMode.ANY`, por padrão o valor é definido como `RoleMatchingMode.ALL`.


Para que a validação completa use o campo `agenciaLocation` passando localização do campo agência, que pode estar na `Query` ou `Body`, deste modo é possível restringir ou validar por agência a busca. Caso seja passado uma agência que não tiver permissão será bloqueado a requisição e se o campo vier como `null` será definido o campo como sendo uma lista de agências que o usuário possui permissão, deste modo é possível filtrar sempre a resposta por este campo. Cado a própriedade que tenha as agências tenha o nome diferente de `agencia`, utilize a propriedade `agenciaFieldName` para passar o nome do campo.

Atenção: Se for uma request de solicitação em alguns casos é necessário um validação manual posterior para validar de o objeto passando realmente se refere-se a uma das agência passada neste campo. Exemplo usuário solicita um recurso que tenha o id = 5, mas ao buscar no banco o mesmo se refere-se a uma agencia diferente, deste caso a validação deve ser manual.

Para uma validação ainda mais customizada do campo a ser usado como agência utilize da propriedade `getAgenciaValue`:

```javascript
  @RolesCustom({
    roles: ['ROLE_CRIAR'],
    getAgenciaValue: (request) => {
      if (request.body?.tipoTransferencia == 'entrada') {
        return [request.body?.contaCreditada.agencia];
      } else if (request.body?.tipoTransferencia == 'saida') {
        return [request.body?.contaDebitada.agencia];
      }
    },
  })
```

### Obter usuário logado

Para obter informações do usuário logado import o modulo `RequestInfoCoreModule` que irá disponibilizar o service `RequestInfoCoreService`. Deve ser sempre importado no módulo que for utilizar o recurso;

```javascript
declare class RequestInfoCoreService {
    getRequest(): Request;
    getHeaders(): any;
    getIp(): string;
    getAuthorization(): string;
    getUser(): UserRequest;
    getUserId(): string;
    getUserEmail(): string;
    // Se for o usuário de uma agência retornará o código da agência
    getUserAgencia(): string;
}
```


### Logs automático de todas as request recebidas

Para Salvar todas as request import `LogRequestCoreModule.request()`

Caso queira salvar também todas as tentativas de acesso que resultou em um erro `Forbidden - 403` realiza a importação também do modulo `LogRequestCoreModule.forbidden()`


```javascript
LogRequestCoreModule.request(),
LogRequestCoreModule.forbidden(),
```


### Gestão de logs

Para salvar logs no formato padrão importe `LogCoreModule` e user o `LogCoreService`. Tome cuidado para não criar logs repetidos, caso já este utilizando o `LogRequestCoreModule` já já irá salvar todas as request;

```javascript
await this.logService.salvarLog({
  statusCode: 500,
  message: 'Erro ao tentar ...',
  request: dto,
  response: erro,
})
```

#### Campos opcionais do log (systemName, ip e correlationId)

Além dos campos gravados sempre (`dataOcorrencia`, `message`, `request`, `response`, `info`, `statusCode`, `tipo`, `user`), existem três campos opcionais que só são gravados quando configurados em `PluginCoreModule.forRoot({ log: ... })`:

```javascript
PluginCoreModule.forRoot({
  log: {
    systemName: 'core-pix',           // grava o campo `systemName` em todos os logs
    salvarIp: true,                   // grava o `ip` de origem da request
    salvarCorrelationId: true,        // grava o `correlationId` da request
    correlationIdHeader: 'x-correlation-id', // default: 'x-correlation-id'
  },
}),
```

O `correlationId` é lido do header configurado pelo `LogRequestCoreModule.request()` e propagado no contexto da request, então logs manuais (`salvarLog`) feitos durante aquela request também saem com o mesmo id.

Essas flags controlam apenas a **captura automática**: `systemName`, `ip` e `correlationId` informados explicitamente no DTO são sempre gravados, mesmo com a config desligada.

```javascript
await this.logService.salvarLog({
  message: 'Conciliação finalizada',
  correlationId: idDoLote, // sempre gravado, independente da config
})
```

### Console/logs das requests

Para gerar consoles automático com todas as informações recebidas.

```javascript
LogConsoleCoreModule,
```

Utiliza o nível `Verbose` para as printar as informações de todas as requests e responses de sucesso. E utiliza o nível `Error` para os responses que resultar em algum erro.

O log sai no formato abaixo, com a tag `LoggingInterceptor`:

```
VERBOSE [LoggingInterceptor] Start Request for /qrcode/decodificar
method=POST ip=127.0.0.1 user=fulano@banco.com
{"qrCode":"000201..."}

VERBOSE [LoggingInterceptor] End Request for /qrcode/decodificar
method=POST::201 ip=127.0.0.1 user=fulano@banco.com duration=42ms
{"valor":10.5}
```

Como cada ambiente configura de um jeito, use `LogConsoleCoreModule.forRoot(...)` para customizar (todos os campos são opcionais):

```javascript
LogConsoleCoreModule.forRoot({
  habilitado: configService.get('LOG_REQUEST') !== 'false', // default: env LOG_REQUEST (ligado se ausente ou 'true')
  nivel: 'log',                                             // default: 'verbose' — nível do log de sucesso
  contexto: 'LoggingInterceptor',                           // default: 'LoggingInterceptor' — tag exibida no log
  rotasIgnoradas: ['/ispb', '/webhook', '/feriado', '/ping'], // default: [] — ignora o log de sucesso dessas rotas (por prefixo)
}),
```

Erros são sempre logados (nível `Error`), mesmo em rota ignorada ou com o log de sucesso desabilitado. O `End Request` também respeita o `@LogCustom({ salvarSucesso: false })` da rota.

### Customizando o log de uma rota (@LogCustom)

Para customizar o que é logado numa rota — omitir/mascarar dados sensíveis (senha, token, etc.) ou controlar se o log de sucesso é salvo — use o decorador `@LogCustom(...)` no controller ou handler. Funciona tanto para o log salvo no Mongo (`LogRequestCoreModule.request()`) quanto para o console (`LogConsoleCoreModule()`), ambos leem a mesma configuração.

```javascript
@LogCustom({
  tipo: 'STR',                            // tipo do log, usado para filtros (só Mongo)
  mensagem: 'Buscando todas as STR',      // substitui a mensagem padrão `method: url` (só Mongo)
  excluirCampoRequest: ['body.senha'],    // remove o campo por completo do log
  mascararCampoResponse: ['token'],       // mantém o campo no log, mas troca o valor por '***'
  excluirRequest: true,                   // não loga o request inteiro desta rota
  excluirResponse: true,                  // não loga o response inteiro desta rota
})
```

Os campos em `excluirCampoRequest`/`excluirCampoResponse`/`mascararCampoRequest`/`mascararCampoResponse` são caminhos separados por ponto (ex.: `'body.senha'`, `'usuario.token'`). A diferença entre remover e mascarar: `excluirCampoRequest`/`excluirCampoResponse` apagam o campo do log; `mascararCampoRequest`/`mascararCampoResponse` mantêm o campo presente, só substituindo o valor por uma máscara (`'***'` por padrão), útil quando você quer saber que o campo veio preenchido sem expor o valor.

`excluirRequest`/`excluirResponse` têm prioridade sobre as listas de campos: se `true`, nem tenta aplicar remoção/mascaramento, simplesmente não loga aquela parte.

Quando o response de sucesso é grande ou sensível (ex.: imagem/base64 de uma decodificação de QRCode), mas você ainda quer o log de erro completo, use `salvarResponseSucesso: false`:

```javascript
@LogCustom({
  salvarResponseSucesso: false, // não loga o response quando a requisição for bem-sucedida (2xx); em erro, o response continua sendo logado
})
```

Para não persistir no Mongo nenhum log (nem request, nem response) de requisições bem-sucedidas — o erro continua sempre sendo persistido — use `salvarSucesso: false`. Diferente de `salvarResponseSucesso`, essa opção não afeta o log de console:

```javascript
@LogCustom({
  salvarSucesso: false, // não persiste no Mongo o log desta rota quando a requisição for bem-sucedida (2xx)
})
```

#### Configuração dos níveis de logs ativados

Para desabilitar algum nível de log, basta rodas o seguinte comando ao inicializar a aplicação:

```javascript
const listLogger: LogLevel[] = ['log', 'debug', 'error', 'warn', 'verbose', 'fatal'];
Logger.overrideLogger(listLogger);
```

### Tratamento de erro

Consolida o fluxo de identificar o erro → registrar no Mongo → notificar o Guardião (se for um erro inesperado) → relançar, evitando reimplementar essa lógica em cada serviço. Import `TratamentoErroCoreModule.forRoot(...)`:

```javascript
TratamentoErroCoreModule.forRoot(
  {
    tipoLogPadrao: 'SYSTEM', // opcional, default 'SYSTEM'
    mensagemPadrao: 'Erro inesperado, tente novamente mais tarde', // opcional
  },
  // Liga o token de persistência ao repositório Mongo já existente no seu serviço.
  // O repositório precisa implementar `salvarRequisicao(dto)` (interface `TratamentoErroLogRepository`).
  { provide: CORE_TRATAMENTO_ERRO_LOG_REPOSITORY, useExisting: LogMongoRepositoryService },
  // Parâmetro opcional: módulos a importar para que o `useExisting` acima consiga resolver
  // `LogMongoRepositoryService` (necessário se ele não estiver em um módulo `@Global()`).
  [LogMongoModule],
),
```

Depois, injete `TratamentoErroCoreService` onde precisar tratar erros:

```javascript
try {
  ...
} catch (error) {
  await this.tratamentoErro.tratar(error, { agencia: '1234', tipoLog: 'ARRECADACAO' });
}
```

- **`tratar(error, contexto?)`**: identifica o erro (`HttpException`, erro Axios, ou erro genérico), registra no Mongo, notifica o Guardião se for um erro inesperado (status ≥ 500), e relança o erro original (ou `InternalServerErrorException` se não for um `HttpException`). Uso típico: substituir um `throw error` cru dentro de um `catch`.
- **`notificar(error, contexto?)`**: mesma identificação/registro/notificação de `tratar`, mas não relança, use quando o erro já foi tratado de outra forma e você só precisa registrar/alertar.
- **`notificarSempre(mensagem, contexto?)`**: registra e notifica sem precisar de um objeto de erro, para avisos manuais que não vieram de uma exceção.

O parâmetro `contexto` (opcional, interface `ContextoErro`) aceita `agencia`, `request` (payload de origem (**não passe headers/credenciais**), ele vai para o Mongo e para o card do Teams), `tipoLog`, `statusCode`, `mensagem` (sobrescreve a mensagem usada no log/notificação) e `falha` (sobrescreve o campo enviado ao Guardião).

Uma falha ao notificar o Guardião ou ao registrar no Mongo nunca trava o fluxo, ambas são protegidas internamente e apenas logadas via `Logger` em caso de erro, para que uma indisponibilidade externa não derrube a aplicação nem mascare o erro de negócio original.

<br/>
<br/>
<br/>
<br/>
<br/>

# Módulos em desenvolvimento

## HttpCoreModele
- Implementa um Axios passando sempre um token válido na request


## GuardiaoCoreModule
- Integração com o teams e com o logs do sistema;

## WebhookCoreModule
- Recebe o dto e o evento
- trata os possíveis erros
  - core indisponivel
  - webhook não cadastrado
  - erro ao entregar apenas 1 dos evento (quando tem mais de 1 url, e pelo menos em 1 foi entregue)
- Qualquer tipo de erro salva log e informa o guardião
- Coleção de eventos
  sucesso e erros
