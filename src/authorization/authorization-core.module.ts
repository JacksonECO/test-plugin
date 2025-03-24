import { Module } from "@nestjs/common";
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationOption } from "src/plugin-core.module";
import { AuthServerBackService } from "./auth-server/auth-server-back.service";
import { AuthServerKeycloakService } from "./auth-server/auth-server-keycloak.service";
import { AuthServerService } from "./auth-server/auth-server.interface";
import { CORE_AUTHORIZATION_OPTION } from "src/constants";
import { AuthCustomGuard } from "./guard/auth-custom.guard";
import { RoleCustomGuard } from "./guard/role-custom.guard";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthCustomGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleCustomGuard,
    },
    {
      inject: [CORE_AUTHORIZATION_OPTION],
      provide: AuthServerService,
      useFactory: (authorizationOption: AuthorizationOption) => {
        if (authorizationOption.isCoreServiceAuth) {
          return new AuthServerBackService(authorizationOption);
        } else {
          return new AuthServerKeycloakService(authorizationOption);
        }
      },
    },
  ],
})
export class AuthorizationCoreModule { }