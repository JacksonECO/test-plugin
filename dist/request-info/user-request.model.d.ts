export declare class UserRequest {
    exp: number;
    iat: number;
    jti: string;
    iss: string;
    sub: string;
    typ: string;
    azp: string;
    sid: string;
    scope: string;
    name: string;
    email: string;
    realm_access: RealmAccess;
    resource_access: ResourceAccess;
    static fromJSON(data: any): UserRequest;
}
export declare class RealmAccess {
    roles: string[];
}
export declare class ResourceAccess {
    [key: string]: ClientAccess;
}
export declare class ClientAccess {
    roles: string[];
}
