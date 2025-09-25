import Redis from 'ioredis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

export class CacheService {
  private redis: Redis | null = null;
  private defaultTTL = 3600; // 1 hour
  private enabled = false;

  constructor() {
    // Enable via env; default off to avoid noisy errors in dev if Redis isn't running
    const envEnabled = (process.env.CACHE_ENABLED || '').toLowerCase() === 'true';
    this.enabled = envEnabled;

    if (!this.enabled) {
      console.log('[Cache] Disabled (set CACHE_ENABLED=true to enable)');
      return;
    }

    try {
      const baseOptions: any = {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT || 6379),
        lazyConnect: true,
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1,
        retryStrategy: (times: number) => Math.min(times * 100, 1000),
      };
      if (process.env.REDIS_PASSWORD) {
        baseOptions.password = process.env.REDIS_PASSWORD as string;
      }
      this.redis = new Redis(baseOptions);

      this.redis.on('error', (error) => {
        console.warn('[Cache] Redis connection error:', error?.message || error);
      });

      this.redis.on('connect', () => {
        console.log('✅ Connected to Redis cache');
      });

      // Attempt connection, but gracefully disable on failure
      this.redis.connect().catch((err) => {
        console.warn('[Cache] Failed to connect. Cache will be disabled. Reason:', err?.message || err);
        this.enabled = false;
        this.redis = null;
      });
    } catch (err) {
      console.warn('[Cache] Initialization failed. Disabling cache. Reason:', (err as any)?.message || err);
      this.enabled = false;
      this.redis = null;
    }
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled || !this.redis) return null;
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set a value in cache
   */
  async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    if (!this.enabled || !this.redis) return false;
    try {
      const ttl = options.ttl || this.defaultTTL;
      const serializedValue = JSON.stringify(value);
      
      if (ttl > 0) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
      
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete a value from cache
   */
  async delete(key: string): Promise<boolean> {
    if (!this.enabled || !this.redis) return false;
    try {
      const result = await this.redis.del(key);
      return result > 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Delete multiple keys with pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    if (!this.enabled || !this.redis) return 0;
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;
      
      const result = await this.redis.del(...keys);
      return result;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.enabled || !this.redis) return false;
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Get or set a value with automatic caching
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    if (!this.enabled || !this.redis) {
      return await fetcher();
    }
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, fetch and cache the result
      const value = await fetcher();
      await this.set(key, value, options);
      return value;
    } catch (error) {
      console.error('Cache getOrSet error:', error);
      // If caching fails, just return the fetched value
      return await fetcher();
    }
  }

  /**
   * Invalidate cache for a user
   */
  async invalidateUser(userId: string): Promise<void> {
    if (!this.enabled || !this.redis) return;
    try {
      await this.deletePattern(`user:${userId}:*`);
      await this.deletePattern(`goals:${userId}:*`);
      await this.deletePattern(`tasks:${userId}:*`);
    } catch (error) {
      console.error('Cache invalidate user error:', error);
    }
  }

  /**
   * Invalidate cache for a specific goal
   */
  async invalidateGoal(goalId: string): Promise<void> {
    if (!this.enabled || !this.redis) return;
    try {
      await this.deletePattern(`goal:${goalId}:*`);
      await this.deletePattern(`tasks:goal:${goalId}:*`);
    } catch (error) {
      console.error('Cache invalidate goal error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    connected: boolean;
    memory: any;
    keys: number;
  }> {
    if (!this.enabled || !this.redis) {
      return { connected: false, memory: null, keys: 0 };
    }
    try {
      const info = await this.redis.info('memory');
      const keys = await this.redis.dbsize();
      
      return {
        connected: this.redis.status === 'ready',
        memory: this.parseMemoryInfo(info),
        keys
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return {
        connected: false,
        memory: null,
        keys: 0
      };
    }
  }

  private parseMemoryInfo(info: string): Record<string, string> {
    const lines = info.split('\r\n');
    const memory: Record<string, string> = {};
    
    lines.forEach(line => {
      if (line.includes(':')) {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts[0] as string;
          const value = parts.slice(1).join(':');
          memory[key] = value;
        }
      }
    });
    
    return memory;
  }

  /**
   * Close the Redis connection
   */
  async close(): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.quit();
    } catch (error) {
      console.error('Cache close error:', error);
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();
export default cacheService;
