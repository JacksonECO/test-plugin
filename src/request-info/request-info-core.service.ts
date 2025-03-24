import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from './user-request.model';

@Injectable()
export class RequestInfoCoreService {
  constructor(@Inject(REQUEST) private readonly request: Request) { }

  getRequest(): Request {
    return this.request;
  }

  getHeaders(): any {
    return this.request.headers;
  }

  getIp(): string {
    return this.request.headers?.['x-forwarded-for'] as string;
  }

  getAuthorization(): string {
    return this.request.headers?.['authorization'] as string;
  }

  getUser(): UserRequest {
    return UserRequest.fromJSON(this.request?.['user']);
  }

  getUserId(): string {
    return this.request?.['user']?.['sub'] as string;
  }

  getUserEmail(): string {
    return this.request?.['user']?.['email'] as string;
  }

  getUserAgencia(): string {
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
}