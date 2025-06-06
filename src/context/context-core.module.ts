import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextCoreInterceptor } from './context-core.interceptor';
import { ContextCoreService } from './context-core.service';

export * from './context-core.service';

@Module({
  providers: [ContextCoreService],
  exports: [ContextCoreService],
})
export class ContextCoreModule {
  static forRoot() {
    return {
      module: ContextCoreModule,
      providers: [
        ContextCoreService,
        {
          provide: APP_INTERCEPTOR,
          useClass: ContextCoreInterceptor,
        },
      ],
    };
  }
}
