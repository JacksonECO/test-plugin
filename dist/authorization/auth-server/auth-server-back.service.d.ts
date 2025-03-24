import { AuthServerService } from "./auth-server.interface";
export declare class AuthServerBackService extends AuthServerService {
    validateToken(jwt: string): Promise<any[]>;
}
