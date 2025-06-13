import { Module } from '@nestjs/common';
import { GuardianCoreService } from './guardian-core.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GuardianCoreService],
  exports: [GuardianCoreService],
})
export class GuardianCoreModule {}
