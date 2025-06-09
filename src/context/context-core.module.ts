import { Module } from '@nestjs/common';
import { ContextCoreService } from './context-core.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextCoreInterceptor } from './context-core.interceptor';

export * from './context-core.service';

@Module({
  providers: [ContextCoreService],
  exports: [ContextCoreService],
})
export class ContextCoreModule {
  static interceptor() {
    return {
      provide: APP_INTERCEPTOR,
      useClass: ContextCoreInterceptor,
    };
  }
}
