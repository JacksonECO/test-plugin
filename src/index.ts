export * from './plugin-core.module';
export * from './options.dto';

// Autenticação e autorização das rotas
export * from './authorization/authorization-core.module';
export * from './authorization/decorator/authorization.decorator';
export * from './authorization/decorator/roles.decorator';
export * from './authorization/decorator/roles.enum';
export * from './authorization/guard/auth-custom.guard';
export * from './authorization/guard/role-custom.guard';

// Obter o usuário autenticado
export * from './request-info/request-info-core.module';
export * from './request-info/request-info-core.service';

// Gerenciar logs
export * from './log/log-core.module';
export * from './log/log-core.model';
export * from './log/log-core.service';

// Salvar log das requisições
export * from './log-request/log-request-core.module';

// Printar log das requisições
export * from './log-console/log-console-core.module';

// Requisição HTTP com gestão de tokens
export * from './http/http-core.module';
export * from './http/http-core.service';