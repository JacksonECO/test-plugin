import { Module } from '@nestjs/common';
import { HttpCoreModule } from 'src/http/http-core.module';
import { WebhookCoreService } from './webhook-core.service';

@Module({
  imports: [HttpCoreModule],
  providers: [WebhookCoreService],
  exports: [WebhookCoreService],
})
export class WebhookCoreModule {}
