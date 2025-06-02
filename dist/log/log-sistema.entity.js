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
exports.createLogSistemaSchema = exports.LogSistemaCoreEntity = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let LogSistemaCoreEntity = class LogSistemaCoreEntity {
    dataOcorrencia;
    message;
    request;
    response;
    info;
    statusCode;
    tipo;
    user;
};
exports.LogSistemaCoreEntity = LogSistemaCoreEntity;
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], LogSistemaCoreEntity.prototype, "dataOcorrencia", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LogSistemaCoreEntity.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], LogSistemaCoreEntity.prototype, "request", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], LogSistemaCoreEntity.prototype, "response", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], LogSistemaCoreEntity.prototype, "info", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], LogSistemaCoreEntity.prototype, "statusCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LogSistemaCoreEntity.prototype, "tipo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LogSistemaCoreEntity.prototype, "user", void 0);
exports.LogSistemaCoreEntity = LogSistemaCoreEntity = __decorate([
    (0, mongoose_1.Schema)()
], LogSistemaCoreEntity);
const createLogSistemaSchema = (collectionName) => {
    const schema = mongoose_1.SchemaFactory.createForClass(LogSistemaCoreEntity);
    schema.set('collection', collectionName);
    return schema;
};
exports.createLogSistemaSchema = createLogSistemaSchema;
//# sourceMappingURL=log-sistema.entity.js.map