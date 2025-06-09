import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { createLogSistemaSchema, LogSistemaCoreEntity } from './log-sistema.entity';
import { LogCoreRepository } from './log-core.repository';
import { LogCoreService } from './log-core.service';
import { CORE_LOG_OPTION } from 'src/constants';
import { LogOptions } from 'src/options.dto';
import { ContextCoreModule } from 'src/context/context-core.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: LogSistemaCoreEntity.name,
        inject: [CORE_LOG_OPTION],
        useFactory: (logOptions: LogOptions) => createLogSistemaSchema(logOptions.logSistemaCollectionName),
      },
    ]),
    ContextCoreModule,
  ],
  providers: [LogCoreRepository, LogCoreService],
  exports: [LogCoreService],
})
export class LogCoreModule {}
