import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageCacheBackend {
  get<T>(key: string): T | null {
    const item = JSON.parse(localStorage.getItem(key)) as CacheEntry<T>;

    if (!item) {
      return null;
    }

    const isExpired = item.expiresAt < Date.now();

    if (isExpired) {
      console.info('LocalStorageCacheBackend: removing expired cache entry for key', key);

      localStorage.removeItem(key);

      return null;
    }

    return item.value;
  }

  set<T>(key: string, value: T): void {
    console.info('LocalStorageCacheBackend: setting cache entry for key', key);

    const item: CacheEntry<T> = {
      value,
      expiresAt: this.calculateExpiresAt(),
    }

    localStorage.setItem(key, JSON.stringify(item));
  }

  private calculateExpiresAt(): number {
    return Date.now() + environment.apiCacheTimeout;
  }
}
