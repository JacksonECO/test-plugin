import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LogSistemaEntity, LogSistemaSchema } from "./log-sistema.entity";
import { LogCoreRepository } from "./log-core.repository";
import { RequestInfoCoreModule } from "src/request-info/request-info-core.module";
import { LogCoreService } from "./log-core.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogSistemaEntity.name, schema: LogSistemaSchema },
    ]),
    RequestInfoCoreModule,
  ],
  providers: [
    LogCoreRepository,
    LogCoreService,
  ],
  exports: [LogCoreService],
})
export class LogCoreModule { }