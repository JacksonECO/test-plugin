import { Module } from '@nestjs/common';
import { AuthServerCoreModule } from 'src/auth-server/auth-server.module';
import { RequestInfoCoreModule } from 'src/request-info/request-info-core.module';
import { HttpCoreRequestService } from './http-core-request.service';

@Module({
  imports: [AuthServerCoreModule, RequestInfoCoreModule],
  providers: [
    HttpCoreRequestService,
    {
      provide: 'default-undefined',
      useValue: undefined,
    },
  ],
  exports: [HttpCoreRequestService],
})
export class HttpCoreRequestModule {}
