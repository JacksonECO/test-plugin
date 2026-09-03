"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogConsoleOptions = exports.TratamentoErroOptions = exports.GuardianOptions = exports.WebhookOptions = exports.WebhookConfigOptions = exports.LogOptions = exports.ClientOptions = exports.UserOptions = exports.AuthorizationOption = exports.PluginCoreOption = void 0;
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
        this.user = Object.assign({}, input?.user);
        this.client = Object.assign({}, input?.client);
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
    systemName;
    salvarIp = false;
    salvarCorrelationId = false;
    correlationIdHeader = 'x-correlation-id';
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
class TratamentoErroOptions {
    constructor(input) {
        Object.assign(this, input);
    }
    tipoLogPadrao = 'SYSTEM';
    mensagemPadrao = 'Erro inesperado, tente novamente mais tarde';
}
exports.TratamentoErroOptions = TratamentoErroOptions;
class LogConsoleOptions {
    constructor(input) {
        Object.assign(this, input);
    }
    habilitado;
    nivel = 'verbose';
    contexto = 'LoggingInterceptor';
    rotasIgnoradas = [];
}
exports.LogConsoleOptions = LogConsoleOptions;
//# sourceMappingURL=options.dto.js.map