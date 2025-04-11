import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthCustomGuard } from './guard/auth-custom.guard';
import { RoleCustomGuard } from './guard/role-custom.guard';
import { AuthServerCoreModule } from 'src/auth-server/auth-server.module';

@Module({
  imports: [AuthServerCoreModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthCustomGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleCustomGuard,
    },
  ],
})
export class AuthorizationCoreModule {}
