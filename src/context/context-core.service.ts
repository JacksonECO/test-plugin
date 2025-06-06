import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class ContextCoreService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  constructor() {}

  run(callback: (...args: any[]) => void) {
    this.asyncLocalStorage.run(new Map(), callback);
  }

  set(key: string, value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  get(key: string) {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  }

  getAll() {
    return this.asyncLocalStorage.getStore();
  }

  importRequest(request: Request): void {
    if (!request) return;

    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set('ip', request.headers?.['x-forwarded-for']);
      store.set('userId', request?.['user']?.['sub']);
      store.set('userEmail', request?.['user']?.['email']);
      store.set('auth', request.headers?.['authorization']);
    }
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
    return this.get('info');
  }

  addInfo(data: Record<string, string | number>): void {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set('info', {
        ...(store.get('info') || {}),
        ...data,
      });
    }
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
