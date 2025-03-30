import { AuthServerService } from "./auth-server.interface";
export declare class AuthServerBackService extends AuthServerService {
    private logger;
    validateToken(jwt: string): Promise<[boolean, any]>;
    getTokenForce(): Promise<string>;
}
