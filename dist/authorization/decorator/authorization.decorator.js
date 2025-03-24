"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAuth = exports.Public = exports.Protected = exports.META_UNPROTECTED_AUTH = exports.META_UNPROTECTED = void 0;
const common_1 = require("@nestjs/common");
exports.META_UNPROTECTED = 'MetaUnprotected';
exports.META_UNPROTECTED_AUTH = 'MetaUnprotectedAuth';
const Protected = () => (0, common_1.SetMetadata)(exports.META_UNPROTECTED, false);
exports.Protected = Protected;
const Public = () => (0, common_1.SetMetadata)(exports.META_UNPROTECTED, true);
exports.Public = Public;
const PublicAuth = () => (0, common_1.SetMetadata)(exports.META_UNPROTECTED_AUTH, true);
exports.PublicAuth = PublicAuth;
//# sourceMappingURL=authorization.decorator.js.map