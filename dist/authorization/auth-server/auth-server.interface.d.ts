import { Logger } from "@nestjs/common";
import { AuthorizationOption } from "src/plugin-core.module";
export declare abstract class AuthServerService {
    protected authorizationOption: AuthorizationOption;
    protected logger: Logger;
    constructor(authorizationOption: AuthorizationOption);
    abstract validateToken(jwt: string): Promise<any[]>;
}
