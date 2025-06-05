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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCoreRequestService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const request_info_core_service_1 = require("../request-info/request-info-core.service");
let HttpCoreRequestService = class HttpCoreRequestService {
    requestInfo;
    axios;
    constructor(requestInfo) {
        this.requestInfo = requestInfo;
        this.axios = this.createInstance();
    }
    getUri(config) {
        return this.axios.getUri(config);
    }
    request(config) {
        return this.axios.request(config);
    }
    get(url, config) {
        return this.axios.get(url, config);
    }
    delete(url, config) {
        return this.axios.delete(url, config);
    }
    head(url, config) {
        return this.axios.head(url, config);
    }
    options(url, config) {
        return this.axios.options(url, config);
    }
    post(url, data, config) {
        return this.axios.post(url, data, config);
    }
    put(url, data, config) {
        return this.axios.put(url, data, config);
    }
    patch(url, data, config) {
        return this.axios.patch(url, data, config);
    }
    postForm(url, data, config) {
        return this.axios.postForm(url, data, config);
    }
    putForm(url, data, config) {
        return this.axios.putForm(url, data, config);
    }
    patchForm(url, data, config) {
        return this.axios.patchForm(url, data, config);
    }
    createInstance() {
        const axios = axios_1.default.create({
            headers: { 'Content-Type': 'application/json' },
        });
        axios.interceptors.request.use(async (config) => {
            try {
                if (!config?.headers?.Authorization) {
                    config.headers.Authorization = this.requestInfo.getAuthorization();
                }
            }
            catch (_) {
            }
            return config;
        });
        return axios;
    }
};
exports.HttpCoreRequestService = HttpCoreRequestService;
exports.HttpCoreRequestService = HttpCoreRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_info_core_service_1.RequestInfoCoreService])
], HttpCoreRequestService);
//# sourceMappingURL=http-core-request.service.js.map