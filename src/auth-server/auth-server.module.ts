import { Module } from '@nestjs/common';
import { CORE_AUTHORIZATION_OPTION } from 'src/constants';
import { AuthServerKeycloakService } from './auth-server-keycloak.service';
import { AuthServerBackService } from './auth-server-back.service';
import { AuthServerService } from './auth-server.interface';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthorizationOption } from 'src/options.dto';

@Module({
  imports: [CacheModule.register({ isGlobal: false, cacheId: 'auth-core-plugin' })],
  providers: [
    {
      provide: AuthServerService,
      inject: [CORE_AUTHORIZATION_OPTION, CACHE_MANAGER],
      useFactory: (authorizationOption: AuthorizationOption, cacheManager: Cache) => {
        if (authorizationOption.isCoreServiceAuth) {
          return new AuthServerBackService(authorizationOption, cacheManager);
        } else {
          return new AuthServerKeycloakService(authorizationOption, cacheManager);
        }
      },
    },
  ],
  exports: [AuthServerService],
})
export class AuthServerCoreModule {}
