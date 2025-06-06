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
    run(callback) {
        this.asyncLocalStorage.run(new Map(), callback);
    }
    set(key, value) {
        const store = this.asyncLocalStorage.getStore();
        if (store) {
            store.set(key, value);
        }
    }
    get(key) {
        const store = this.asyncLocalStorage.getStore();
        return store ? store.get(key) : undefined;
    }
    getAll() {
        return this.asyncLocalStorage.getStore();
    }
    importRequest(request) {
        if (!request)
            return;
        const store = this.asyncLocalStorage.getStore();
        if (store) {
            store.set('ip', request.headers?.['x-forwarded-for']);
            store.set('userId', request?.['user']?.['sub']);
            store.set('userEmail', request?.['user']?.['email']);
            store.set('auth', request.headers?.['authorization']);
        }
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
        return this.get('info');
    }
    addInfo(data) {
        const store = this.asyncLocalStorage.getStore();
        if (store) {
            store.set('info', {
                ...(store.get('info') || {}),
                ...data,
            });
        }
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