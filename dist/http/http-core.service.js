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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var HttpCoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCoreService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const auth_server_interface_1 = require("../auth-server/auth-server.interface");
const constants_1 = require("../constants");
const options_dto_1 = require("../options.dto");
const request_info_core_service_1 = require("../request-info/request-info-core.service");
let HttpCoreService = HttpCoreService_1 = class HttpCoreService {
    authorizationOption;
    authServer;
    requestInfo;
    isTokenRequest;
    axios;
    constructor(authorizationOption, authServer, requestInfo, isTokenRequest) {
        this.authorizationOption = authorizationOption;
        this.authServer = authServer;
        this.requestInfo = requestInfo;
        this.isTokenRequest = isTokenRequest;
        this.isTokenRequest =
            this.isTokenRequest === false ? false : this.isTokenRequest || this.authorizationOption?.isTokenRequestDefault;
        this.axios = this.createInstance(this.isTokenRequest);
    }
    token(isTokenRequest) {
        return new HttpCoreService_1(this.authorizationOption, this.authServer, this.requestInfo, isTokenRequest);
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
    createInstance(isTokenRequest) {
        const axios = axios_1.default.create({
            headers: { 'Content-Type': 'application/json' },
        });
        axios.interceptors.request.use(async (config) => {
            try {
                if (!config?.headers?.Authorization) {
                    if (isTokenRequest && this.requestInfo.getAuthorization()) {
                        config.headers.Authorization = this.requestInfo.getAuthorization();
                    }
                    else {
                        config.headers.Authorization = await this.authServer.getToken();
                    }
                }
            }
            catch (_) {
            }
            return config;
        });
        axios.interceptors.response.use((response) => response, async (error) => {
            const originalRequest = error.config;
            if (isTokenRequest || error?.response?.status !== 401) {
                return Promise.reject(error);
            }
            if (originalRequest._retry) {
                return Promise.reject(error);
            }
            try {
                const newToken = await this.authServer.getTokenForce();
                originalRequest.headers['Authorization'] = newToken;
                originalRequest._retry = true;
                return this.axios(originalRequest);
            }
            catch (_error) {
            }
            return Promise.reject(error);
        });
        return axios;
    }
};
exports.HttpCoreService = HttpCoreService;
exports.HttpCoreService = HttpCoreService = HttpCoreService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.CORE_AUTHORIZATION_OPTION)),
    __param(3, (0, common_1.Inject)('default-undefined')),
    __metadata("design:paramtypes", [options_dto_1.AuthorizationOption,
        auth_server_interface_1.AuthServerService,
        request_info_core_service_1.RequestInfoCoreService, Boolean])
], HttpCoreService);
//# sourceMappingURL=http-core.service.js.map