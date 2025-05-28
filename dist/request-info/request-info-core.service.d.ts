import { UserRequest } from './user-request.model';
export declare class RequestInfoCoreService {
    private readonly request;
    constructor(request: Request);
    getRequest(): Request;
    getHeaders(): any;
    getIp(): string;
    getAuthorization(): string;
    getUser(): UserRequest;
    getUserId(): string;
    getUserEmail(): string;
    getUserAgencia(): string;
    getInfo(): Record<string, string | number> | undefined;
    addInfo(data: Record<string, string | number>): void;
}
