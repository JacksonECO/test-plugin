import { DynamicModule, Scope } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LogRequestInterceptor } from './log-request.interceptor';
import { LogCoreModule } from 'src/log/log-core.module';
import { HttpForbiddenFilter } from './http-forbidden.filter';
import { ContextCoreModule } from 'src/context/context-core.module';

export class LogRequestCoreModule {
  static request(): DynamicModule {
    return {
      module: LogRequestCoreModule,
      imports: [LogCoreModule, ContextCoreModule],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          scope: Scope.REQUEST,
          useClass: LogRequestInterceptor,
        },
      ],
    };
  }

  static forbidden(): DynamicModule {
    return {
      module: LogRequestCoreModule,
      imports: [LogCoreModule],
      providers: [
        {
          provide: APP_FILTER,
          scope: Scope.REQUEST,
          useClass: HttpForbiddenFilter,
        },
      ],
    };
  }
}
