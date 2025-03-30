"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServerService = void 0;
class AuthServerService {
    authorizationOption;
    cacheManager;
    static keyAuthCache = 'token_auth';
    constructor(authorizationOption, cacheManager) {
        this.authorizationOption = authorizationOption;
        this.cacheManager = cacheManager;
    }
    async getToken() {
        const token = await this.cacheManager.get(AuthServerService.keyAuthCache);
        if (token) {
            return token;
        }
        return this.getTokenForce();
    }
}
exports.AuthServerService = AuthServerService;
//# sourceMappingURL=auth-server.interface.js.map