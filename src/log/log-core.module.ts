import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSistemaCoreEntity, LogSistemaCoreSchema } from './log-sistema.entity';
import { LogCoreRepository } from './log-core.repository';
import { LogCoreService } from './log-core.service';
import { ContextCoreModule } from 'src/context/context-core.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LogSistemaCoreEntity.name, schema: LogSistemaCoreSchema }]),
    ContextCoreModule,
  ],
  providers: [LogCoreRepository, LogCoreService, LogSistemaCoreEntity],
  exports: [LogCoreService, LogCoreRepository, LogSistemaCoreEntity],
})
export class LogCoreModule {}
