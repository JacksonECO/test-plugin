"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogExclude = exports.META_LOG_EXCLUDE = void 0;
const common_1 = require("@nestjs/common");
exports.META_LOG_EXCLUDE = 'MetaLogExclude';
const LogExclude = (options) => (0, common_1.SetMetadata)(exports.META_LOG_EXCLUDE, options);
exports.LogExclude = LogExclude;
//# sourceMappingURL=log-exclude.decorator.js.map