import { Module } from "@nestjs/common";
import { RequestInfoCoreService } from "./request-info-core.service";

@Module({
  providers: [RequestInfoCoreService],
  exports: [RequestInfoCoreService],
})
export class RequestInfoCoreModule { }