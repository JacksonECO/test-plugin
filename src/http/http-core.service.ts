import { Injectable } from '@nestjs/common';
import axiosGlobal, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthServerService } from 'src/auth-server/auth-server.interface';

@Injectable()
export class HttpCoreService {
  private axios: AxiosInstance;

  constructor(
    private authServer: AuthServerService,
    // private guardiao: GuardiaoCoreService,
  ) {
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
          config.headers.Authorization = await this.authServer.getToken();
        }
      } catch (_) {
        // TODO: Informar guardião
      }

      return config;
    });

    // Interceptor de Resposta
    axios.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;
        if (error?.response?.status !== 401) {
          return Promise.reject(error);
        }

        if (originalRequest._retry) {
          // TODO: Informar guardião
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
        } catch (_error) {
          // TODO: Informar guardião
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
      },
    );

    return axios;
  }
}
