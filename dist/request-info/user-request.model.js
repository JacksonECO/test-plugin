"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAccess = exports.ResourceAccess = exports.RealmAccess = exports.UserRequest = void 0;
class UserRequest {
    exp;
    iat;
    jti;
    iss;
    sub;
    typ;
    azp;
    sid;
    scope;
    name;
    email;
    realm_access;
    resource_access;
    static fromJSON(data) {
        return Object.assign(new UserRequest(), data);
    }
}
exports.UserRequest = UserRequest;
class RealmAccess {
    roles;
}
exports.RealmAccess = RealmAccess;
class ResourceAccess {
}
exports.ResourceAccess = ResourceAccess;
class ClientAccess {
    roles;
}
exports.ClientAccess = ClientAccess;
//# sourceMappingURL=user-request.model.js.map