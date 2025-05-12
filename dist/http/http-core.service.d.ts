import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthServerService } from 'src/auth-server/auth-server.interface';
import { AuthorizationOption } from 'src/options.dto';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
export declare class HttpCoreService {
    private authorizationOption;
    private authServer;
    private requestInfo;
    private isTokenRequest;
    private axios;
    constructor(authorizationOption: AuthorizationOption, authServer: AuthServerService, requestInfo: RequestInfoCoreService, isTokenRequest: boolean);
    token(isTokenRequest: boolean): HttpCoreService;
    getUri(config?: AxiosRequestConfig): string;
    request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
    get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    postForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    putForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    patchForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    private createInstance;
}
