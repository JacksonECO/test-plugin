import { Inject, Injectable } from '@nestjs/common';
import axiosGlobal, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthServerService } from 'src/auth-server/auth-server.interface';
import { CORE_AUTHORIZATION_OPTION } from 'src/constants';
import { AuthorizationOption } from 'src/options.dto';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';

@Injectable()
export class HttpCoreService {
  private axios: AxiosInstance;

  constructor(
    @Inject(CORE_AUTHORIZATION_OPTION) private authorizationOption: AuthorizationOption,
    private authServer: AuthServerService,
    private requestInfo: RequestInfoCoreService,
    // private guardiao: GuardiaoCoreService,
    @Inject('default-undefined') private isTokenRequest: boolean,
  ) {
    this.axios = this.createInstance(this.isTokenRequest || this.authorizationOption?.isTokenRequestDefault);
  }

  token(isTokenRequest: boolean) {
    return new HttpCoreService(this.authorizationOption, this.authServer, this.requestInfo, isTokenRequest);
  }

  getUri(config?: AxiosRequestConfig): string {
    return this.axios.getUri(config);
  }
  request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.request<T, R>(config);
  }
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.get<T, R>(url, config);
  }
  delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.delete<T, R>(url, config);
  }
  head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.head<T, R>(url, config);
  }
  options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.options<T, R>(url, config);
  }
  post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.post<T, R>(url, data, config);
  }
  put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.put<T, R>(url, data, config);
  }
  patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.patch<T, R>(url, data, config);
  }
  postForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.postForm<T, R>(url, data, config);
  }
  putForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.putForm<T, R>(url, data, config);
  }
  patchForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.patchForm<T, R>(url, data, config);
  }

  private createInstance(isTokenRequest: boolean): AxiosInstance {
    const axios = axiosGlobal.create({
      headers: { 'Content-Type': 'application/json' },
    });

    // Interceptor de Requisição
    axios.interceptors.request.use(
      async (config: any) => {
        try {
          // Modificar o config da requisição aqui add o token de autenticação
          if (!config?.headers?.Authorization) {
            if (isTokenRequest && this.requestInfo.getAuthorization()) {
              config.headers.Authorization = this.requestInfo.getAuthorization();
            } else {
              config.headers.Authorization = await this.authServer.getToken();
            }
          }
        } catch (_) {}

        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      },
    );

    // Interceptor de Resposta
    axios.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;
        try {
          if (isTokenRequest || !(error?.response?.status === 401 || error?.response?.status === 403)) {
            return Promise.reject(error);
          }

          if (originalRequest._retry) {
            // Se já tentou uma vez, não tenta de novo
            // Aviso via Guardião
            // this.guardiao.salvaRequest({
            //   title: 'Erro de autenticação',
            //   message: error.message,
            //   url: originalRequest?.url,
            //   body: originalRequest?.data,
            // });
            return Promise.reject(error);
          }

          try {
            const newToken = await this.authServer.getTokenForce();
            originalRequest.headers['Authorization'] = newToken;
            originalRequest._retry = true;

            // devemos retornar a requisição original com o novo token
            return this.axios(originalRequest);
          } catch (error) {
            // Aviso via Guardião
            // this.guardiao.salvaRequest({
            //   title: 'Erro ao tentar se logar durante uma request',
            //   message: error.message,
            //   url: originalRequest?.url,
            //   body: originalRequest?.data,
            // });
          }

          // Tratar o erro da resposta aqui
          return Promise.reject(error);
        } catch (error) {
          // this.guardiao.salvaRequest({
          //   title: 'Erro ao tentar reenviar a request',
          //   message: error.message,
          //   url: originalRequest?.url,
          //   body: originalRequest?.data,
          // });
          return Promise.reject(error);
        }
      },
    );

    return axios;
  }
}
