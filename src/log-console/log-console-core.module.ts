import { DynamicModule, Module, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestInfoCoreModule } from 'src/request-info/request-info-core.module';
import { LogConsoleInterceptor } from './log-console.interceptor';
import { CORE_LOG_CONSOLE_OPTION } from 'src/constants';
import { LogConsoleOptions } from 'src/options.dto';

@Module({
  imports: [RequestInfoCoreModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LogConsoleInterceptor,
    },
  ],
})
export class LogConsoleCoreModule {
  /**
   * Importa o log de console customizando nível, tag, rotas ignoradas e se está habilitado.
   * Sem `forRoot` (importando `LogConsoleCoreModule` direto) valem os defaults de `LogConsoleOptions`.
   *
   * ```javascript
   * LogConsoleCoreModule.forRoot({
   *   habilitado: configService.get('LOG_REQUEST') !== 'false',
   *   nivel: 'log',
   *   rotasIgnoradas: ['/ispb', '/webhook', '/feriado', '/ping'],
   * }),
   * ```
   */
  static forRoot(option?: LogConsoleOptions): DynamicModule {
    return {
      module: LogConsoleCoreModule,
      providers: [
        {
          provide: CORE_LOG_CONSOLE_OPTION,
          useValue: new LogConsoleOptions(option),
        },
      ],
    };
  }
}
