import { AuthServerService } from "./auth-server.interface";
export declare class AuthServerKeycloakService extends AuthServerService {
    validateToken(jwt: string): Promise<any[]>;
}
