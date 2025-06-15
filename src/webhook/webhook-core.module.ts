import { Module } from '@nestjs/common';
import { HttpCoreModule } from 'src/http/http-core.module';
import { WebhookCoreService } from './webhook-core.service';
import { GuardianCoreModule } from 'src/guardian/guardian-core.module';

@Module({
  imports: [HttpCoreModule, GuardianCoreModule],
  providers: [WebhookCoreService],
  exports: [WebhookCoreService],
})
export class WebhookCoreModule {}
