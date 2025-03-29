import { Module, Scope } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { RequestInfoCoreModule } from "src/request-info/request-info-core.module";
import { LogConsoleInterceptor } from "./log-console.interceptor";

@Module({
  imports: [
    RequestInfoCoreModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LogConsoleInterceptor,
    }
  ],
})
export class LogConsoleCoreModule { }