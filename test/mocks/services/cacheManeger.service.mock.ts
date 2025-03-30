import { Cache } from "cache-manager";

export class CacheManagerMock {
  private stores: Record<string, any> = {};

  async get(key: string) {
    return this.stores[key];
  }

  async set(key: string, value: any, _ttl?: number) {
    this.stores[key] = value;
    return value;
  }

  clear() {
    this.stores = {};
  }
}

export const mockCacheManager = (): Cache => new CacheManagerMock() as unknown as Cache;