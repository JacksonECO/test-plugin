import { DynamicModule } from "@nestjs/common";
export declare class AuthorizationOption {
    authServerUrl: string;
    realm: string;
    clientId: string;
    clientSecret: string;
    isCoreServiceAuth?: boolean;
}
export declare class PluginCoreOption {
    authorization: AuthorizationOption;
}
export declare class PluginCoreModule {
    static forRoot(option: PluginCoreOption): DynamicModule;
}
