"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookOptions = exports.LogOptions = exports.ClientOptions = exports.UserOptions = exports.AuthorizationOption = exports.PluginCoreOption = void 0;
class PluginCoreOption {
    authorization;
    log;
    webhook;
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
class LogOptions {
    logSistemaCollectionName = 'log-sistema';
}
exports.LogOptions = LogOptions;
class WebhookOptions {
    constructor(input) {
        Object.assign(this, input);
    }
    url;
    emptyException;
    successAndErrorsException = true;
    emptyAlert = true;
    successAndErrorsAlert = true;
    logOperation = false;
    logCollectionName = 'webhook-sender';
    logCollectionDuration = 15;
    combine(custom) {
        const defaultClass = Object.assign(new WebhookOptions(), this);
        Object.keys(custom).forEach((key) => {
            defaultClass[key] = custom[key];
        });
        return defaultClass;
    }
}
exports.WebhookOptions = WebhookOptions;
//# sourceMappingURL=options.dto.js.map