"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientOptions = exports.UserOptions = exports.AuthorizationOption = exports.PluginCoreOption = void 0;
class PluginCoreOption {
    authorization;
}
exports.PluginCoreOption = PluginCoreOption;
class AuthorizationOption {
    authServerUrl;
    isCoreServiceAuth = false;
    isTokenRequestDefault = true;
    user;
    client;
}
exports.AuthorizationOption = AuthorizationOption;
class UserOptions {
    username;
    password;
}
exports.UserOptions = UserOptions;
class ClientOptions {
    id;
    secret;
    realm;
}
exports.ClientOptions = ClientOptions;
//# sourceMappingURL=options.dto.js.map