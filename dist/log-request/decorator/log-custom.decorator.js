"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogCustom = exports.META_LOG_CUSTOM = void 0;
const common_1 = require("@nestjs/common");
exports.META_LOG_CUSTOM = 'MetaLogCustom';
const LogCustom = (options) => (0, common_1.SetMetadata)(exports.META_LOG_CUSTOM, options);
exports.LogCustom = LogCustom;
//# sourceMappingURL=log-custom.decorator.js.map