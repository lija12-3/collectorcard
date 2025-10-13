import { Injectable, Logger } from '@nestjs/common';

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class CacheProvider {
  private readonly logger = new Logger(CacheProvider.name);
  private readonly cache = new Map<string, CacheItem<any>>();
  private readonly defaultTtl = 300000; // 5 minutes in milliseconds

  set<T>(key: string, value: T, ttl?: number): void {
    try {
      const expiresAt = Date.now() + (ttl || this.defaultTtl);
      this.cache.set(key, { value, expiresAt });
      this.logger.debug(`Cache set for key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to set cache for key: ${key}`, error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = this.cache.get(key);
      
      if (!item) {
        this.logger.debug(`Cache miss for key: ${key}`);
        return null;
      }

      if (Date.now() > item.expiresAt) {
        this.cache.delete(key);
        this.logger.debug(`Cache expired for key: ${key}`);
        return null;
      }

      this.logger.debug(`Cache hit for key: ${key}`);
      return item.value as T;
    } catch (error) {
      this.logger.error(`Failed to get cache for key: ${key}`, error);
      return null;
    }
  }

  delete(key: string): boolean {
    try {
      const deleted = this.cache.delete(key);
      this.logger.debug(`Cache ${deleted ? 'deleted' : 'not found'} for key: ${key}`);
      return deleted;
    } catch (error) {
      this.logger.error(`Failed to delete cache for key: ${key}`, error);
      return false;
    }
  }

  clear(): void {
    try {
      this.cache.clear();
      this.logger.debug('Cache cleared');
    } catch (error) {
      this.logger.error('Failed to clear cache', error);
    }
  }

  has(key: string): boolean {
    try {
      const item = this.cache.get(key);
      if (!item) return false;
      
      if (Date.now() > item.expiresAt) {
        this.cache.delete(key);
        return false;
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to check cache for key: ${key}`, error);
      return false;
    }
  }

  getStats(): { size: number; keys: string[] } {
    // Clean expired items first
    this.cleanExpired();
    
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}
