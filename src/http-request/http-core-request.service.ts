import { Injectable } from '@nestjs/common';
import axiosGlobal, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';

@Injectable()
export class HttpCoreRequestService {
  private axios: AxiosInstance;

  constructor(private requestInfo: RequestInfoCoreService) {
    this.axios = this.createInstance();
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

  private createInstance(): AxiosInstance {
    const axios = axiosGlobal.create({
      headers: { 'Content-Type': 'application/json' },
    });

    // Interceptor de Requisição
    axios.interceptors.request.use(async (config: any) => {
      try {
        // Modificar o config da requisição aqui add o token de autenticação
        if (!config?.headers?.Authorization) {
          config.headers.Authorization = this.requestInfo.getAuthorization();
        }
      } catch (_) {
        // TODO: Informar guardião
      }

      return config;
    });

    return axios;
  }
}
