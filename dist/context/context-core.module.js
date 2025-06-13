"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextCoreModule = void 0;
const common_1 = require("@nestjs/common");
const context_core_service_1 = require("./context-core.service");
const core_1 = require("@nestjs/core");
const context_core_interceptor_1 = require("./context-core.interceptor");
__exportStar(require("./context-core.service"), exports);
let ContextCoreModule = class ContextCoreModule {
    static interceptor() {
        return {
            provide: core_1.APP_INTERCEPTOR,
            useClass: context_core_interceptor_1.ContextCoreInterceptor,
        };
    }
};
exports.ContextCoreModule = ContextCoreModule;
exports.ContextCoreModule = ContextCoreModule = __decorate([
    (0, common_1.Module)({
        providers: [context_core_service_1.ContextCoreService],
        exports: [context_core_service_1.ContextCoreService],
    })
], ContextCoreModule);
//# sourceMappingURL=context-core.module.js.map