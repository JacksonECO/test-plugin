"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesCustom = exports.META_ROLES_CUSTOM = void 0;
const common_1 = require("@nestjs/common");
exports.META_ROLES_CUSTOM = 'MetaRolesCustom';
const RolesCustom = (roleMetaData) => (0, common_1.SetMetadata)(exports.META_ROLES_CUSTOM, roleMetaData);
exports.RolesCustom = RolesCustom;
//# sourceMappingURL=roles.decorator.js.map