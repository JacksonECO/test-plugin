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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestInfoCoreService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const user_request_model_1 = require("./user-request.model");
let RequestInfoCoreService = class RequestInfoCoreService {
    request;
    constructor(request) {
        this.request = request;
    }
    getRequest() {
        return this.request;
    }
    getHeaders() {
        return this.request.headers;
    }
    getIp() {
        return this.request.headers?.['x-forwarded-for'];
    }
    getAuthorization() {
        return this.request.headers?.['authorization'];
    }
    getUser() {
        return user_request_model_1.UserRequest.fromJSON(this.request?.['user']);
    }
    getUserId() {
        return this.request?.['user']?.['sub'];
    }
    getUserEmail() {
        return this.request?.['user']?.['email'];
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
exports.RequestInfoCoreService = RequestInfoCoreService;
exports.RequestInfoCoreService = RequestInfoCoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Request])
], RequestInfoCoreService);
//# sourceMappingURL=request-info-core.service.js.map