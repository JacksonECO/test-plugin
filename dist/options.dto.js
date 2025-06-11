"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianOptions = exports.WebhookOptions = exports.WebhookConfigOptions = exports.LogOptions = exports.ClientOptions = exports.UserOptions = exports.AuthorizationOption = exports.PluginCoreOption = void 0;
class PluginCoreOption {
    constructor(input) {
        this.authorization = new AuthorizationOption(input?.authorization);
        this.log = new LogOptions(input?.log);
        this.webhook = new WebhookOptions(input?.webhook);
        this.guardian = new GuardianOptions(input?.guardian);
    }
    authorization;
    log;
    webhook;
    guardian;
}
exports.PluginCoreOption = PluginCoreOption;
class AuthorizationOption {
    constructor(input) {
        Object.assign(this, input);
        Object.assign(this.user, input.user);
        Object.assign(this.client, input.client);
    }
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
    constructor(input) {
        Object.assign(this, input);
    }
}
exports.LogOptions = LogOptions;
class WebhookConfigOptions {
    constructor(input) {
        Object.assign(this, input);
    }
    emptyException = true;
    successAndErrorsException = false;
    emptyAlert = true;
    successAndErrorsAlert = true;
    combine(custom) {
        const defaultClass = Object.assign(new WebhookOptions(), this);
        Object.keys(custom).forEach((key) => {
            defaultClass[key] = custom[key];
        });
        return defaultClass;
    }
}
exports.WebhookConfigOptions = WebhookConfigOptions;
class WebhookOptions extends WebhookConfigOptions {
    constructor(input) {
        super(input);
        Object.assign(this, input);
    }
    url;
    logOperation = false;
    logCollectionDuration = 15;
}
exports.WebhookOptions = WebhookOptions;
class GuardianOptions {
    constructor(input) {
        Object.assign(this, input);
    }
    url;
    nameSystem;
    codigoBanco;
}
exports.GuardianOptions = GuardianOptions;
//# sourceMappingURL=options.dto.js.map