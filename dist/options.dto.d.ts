export declare class PluginCoreOption {
    authorization: AuthorizationOption;
}
export declare class AuthorizationOption {
    authServerUrl: string;
    isCoreServiceAuth?: boolean;
    isTokenRequestDefault: boolean;
    user: UserOptions;
    client: ClientOptions;
}
export declare class UserOptions {
    username: string;
    password: string;
}
export declare class ClientOptions {
    id: string;
    secret: string;
    realm: string;
}
