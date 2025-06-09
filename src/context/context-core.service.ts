import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class ContextCoreService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  constructor() {}

  run(callback: () => void, value: Map<string, any> = new Map<string, any>()) {
    this.asyncLocalStorage.run(value, callback);
  }

  set(key: string, value: any) {
    this.asyncLocalStorage.enterWith({
      ...(this.asyncLocalStorage.getStore() || new Map()),
      [key]: value,
    });
  }

  get(key: string) {
    return this.asyncLocalStorage.getStore()?.[key];
  }

  getAll() {
    return this.asyncLocalStorage.getStore();
  }

  importRequest(request: Request): void {
    if (!request) return;

    this.asyncLocalStorage.enterWith({
      ...(this.asyncLocalStorage.getStore() || new Map()),
      ...{
        ip: request.headers?.['x-forwarded-for'],
        userId: request?.['user']?.['sub'],
        userEmail: request?.['user']?.['email'],
        auth: request.headers?.['authorization'],
      },
    });
  }

  getUserId(): string {
    return this.get('userId');
  }

  getUserEmail(): string {
    return this.get('userEmail');
  }

  getIp(): string {
    return this.get('ip');
  }

  getInfo(): Record<string, string | number> | undefined {
    return this.get('info') || {};
  }

  addInfo(data: Record<string, string | number>): void {
    this.set('info', {
      ...(this.getInfo() || {}),
      ...data,
    });
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
