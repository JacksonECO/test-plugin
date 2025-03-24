"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMerge = exports.RoleMatchingMode = exports.AgenciaLocation = void 0;
var AgenciaLocation;
(function (AgenciaLocation) {
    AgenciaLocation["QUERY"] = "query";
    AgenciaLocation["BODY"] = "body";
})(AgenciaLocation || (exports.AgenciaLocation = AgenciaLocation = {}));
var RoleMatchingMode;
(function (RoleMatchingMode) {
    RoleMatchingMode["ALL"] = "all";
    RoleMatchingMode["ANY"] = "any";
})(RoleMatchingMode || (exports.RoleMatchingMode = RoleMatchingMode = {}));
var RoleMerge;
(function (RoleMerge) {
    RoleMerge[RoleMerge["OVERRIDE"] = 0] = "OVERRIDE";
    RoleMerge[RoleMerge["ALL"] = 1] = "ALL";
})(RoleMerge || (exports.RoleMerge = RoleMerge = {}));
//# sourceMappingURL=roles.enum.js.map