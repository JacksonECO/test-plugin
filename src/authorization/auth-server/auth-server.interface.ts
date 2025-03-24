import { Inject, Logger } from "@nestjs/common";
import { CORE_AUTHORIZATION_OPTION } from "src/constants";
import { AuthorizationOption } from "src/plugin-core.module";

export abstract class AuthServerService {
  protected logger = new Logger(AuthServerService.name + 'Plugin');

  constructor(
    @Inject(CORE_AUTHORIZATION_OPTION) protected authorizationOption: AuthorizationOption,
  ) { }

  abstract validateToken(jwt: string): Promise<any[]>;
}