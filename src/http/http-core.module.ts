import { Module } from "@nestjs/common";
import { AuthServerCoreModule } from "src/auth-server/auth-server.module";
import { RequestInfoCoreModule } from "src/request-info/request-info-core.module";
import { HttpCoreService } from "./http-core.service";

@Module({
  imports: [
    AuthServerCoreModule,
    RequestInfoCoreModule,
  ],
  providers: [
    HttpCoreService,
    {
      provide: 'default-undefined',
      useValue: undefined
    }
  ],
  exports: [
    HttpCoreService,
  ]
})
export class HttpCoreModule { }