"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextCoreService = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
let ContextCoreService = class ContextCoreService {
    asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
    constructor() { }
    run(callback, value = new Map()) {
        this.asyncLocalStorage.run(value, callback);
    }
    set(key, value) {
        this.asyncLocalStorage.enterWith({
            ...(this.asyncLocalStorage.getStore() || new Map()),
            [key]: value,
        });
    }
    get(key) {
        return this.asyncLocalStorage.getStore()?.[key];
    }
    getAll() {
        return this.asyncLocalStorage.getStore();
    }
    importRequest(request) {
        if (!request)
            return;
        this.asyncLocalStorage.enterWith({
            ...(this.asyncLocalStorage.getStore() || new Map()),
            ...{
                ip: request.headers?.['x-forwarded-for'],
                userId: request?.['user']?.['sub'],
                userEmail: request?.['user']?.['email'],
                auth: request.headers?.['authorization'],
            },
        });
    }
    getUserId() {
        return this.get('userId');
    }
    getUserEmail() {
        return this.get('userEmail');
    }
    getIp() {
        return this.get('ip');
    }
    getInfo() {
        return this.get('info') || {};
    }
    addInfo(data) {
        this.set('info', {
            ...(this.getInfo() || {}),
            ...data,
        });
    }
    getUserAgencia() {
        const email = this.getUserEmail();
        if (!email?.startsWith('agencia_') || !email?.includes('@corebanking.com')) {
            return null;
        }
        const agencia = email.substring(8, 12);
        if (agencia.includes('@')) {
            return null;
        }
        return agencia;
    }
};
exports.ContextCoreService = ContextCoreService;
exports.ContextCoreService = ContextCoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ContextCoreService);
//# sourceMappingURL=context-core.service.js.map