import { performance } from 'perf_hooks';

/**
 * 🚀 In-Memory Caching Service
 * 
 * High-performance in-memory caching layer that mimics Redis interface
 * for vendor listings, search results, and frequently accessed data.
 * Perfect for Replit environments where Redis isn't available.
 */

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
  compress?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  avgResponseTime: number;
  totalRequests: number;
}

interface CacheEntry {
  value: any;
  expiry: number;
}

class MemoryCacheService {
  private cache = new Map<string, CacheEntry>();
  private isConnected = true; // Always connected for in-memory cache
  private stats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    responseTimes: [] as number[]
  };
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    console.log('🚀 In-Memory Cache Service initialized');
    
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry < now) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
    }
  }

  async connect(): Promise<void> {
    console.log('✅ Memory cache connected');
    this.isConnected = true;
  }

  async disconnect(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
    console.log('🔌 Memory cache disconnected');
  }

  private generateKey(key: string, prefix?: string): string {
    const cachePrefix = prefix || 'wedding';
    return `${cachePrefix}:${key}`;
  }

  private async measurePerformance<T>(operation: () => T): Promise<T> {
    const start = performance.now();
    try {
      const result = operation();
      const duration = performance.now() - start;
      this.stats.responseTimes.push(duration);
      
      // Keep only last 1000 response times for stats
      if (this.stats.responseTimes.length > 1000) {
        this.stats.responseTimes = this.stats.responseTimes.slice(-1000);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.stats.responseTimes.push(duration);
      throw error;
    }
  }

  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    if (!this.isConnected) return null;

    this.stats.totalRequests++;
    const cacheKey = this.generateKey(key, options.prefix);

    try {
      const result = await this.measurePerformance(() => {
        const entry = this.cache.get(cacheKey);
        
        if (!entry) {
          return null;
        }
        
        // Check if expired
        if (entry.expiry < Date.now()) {
          this.cache.delete(cacheKey);
          return null;
        }
        
        return entry.value;
      });

      if (result !== null) {
        this.stats.hits++;
        return result as T;
      } else {
        this.stats.misses++;
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    if (!this.isConnected) return;

    const cacheKey = this.generateKey(key, options.prefix);
    const ttl = options.ttl || 300; // Default 5 minutes
    const expiry = Date.now() + (ttl * 1000);

    try {
      await this.measurePerformance(() => {
        this.cache.set(cacheKey, {
          value,
          expiry
        });
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(key: string, options: CacheOptions = {}): Promise<void> {
    if (!this.isConnected) return;

    const cacheKey = this.generateKey(key, options.prefix);

    try {
      await this.measurePerformance(() => {
        this.cache.delete(cacheKey);
      });
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async deletePattern(pattern: string, options: CacheOptions = {}): Promise<void> {
    if (!this.isConnected) return;

    const cachePattern = this.generateKey(pattern, options.prefix);
    const regex = new RegExp(cachePattern.replace('*', '.*'));

    try {
      await this.measurePerformance(() => {
        const keysToDelete: string[] = [];
        
        for (const key of this.cache.keys()) {
          if (regex.test(key)) {
            keysToDelete.push(key);
          }
        }
        
        keysToDelete.forEach(key => this.cache.delete(key));
      });
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }

  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    if (!this.isConnected) return false;

    const cacheKey = this.generateKey(key, options.prefix);

    try {
      const result = await this.measurePerformance(() => {
        const entry = this.cache.get(cacheKey);
        if (!entry) return false;
        
        // Check if expired
        if (entry.expiry < Date.now()) {
          this.cache.delete(cacheKey);
          return false;
        }
        
        return true;
      });
      
      return result;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async increment(key: string, options: CacheOptions = {}): Promise<number> {
    if (!this.isConnected) return 0;

    const cacheKey = this.generateKey(key, options.prefix);

    try {
      return await this.measurePerformance(() => {
        const entry = this.cache.get(cacheKey);
        let currentValue = 0;
        
        if (entry && entry.expiry > Date.now()) {
          currentValue = parseInt(entry.value) || 0;
        }
        
        const newValue = currentValue + 1;
        const ttl = options.ttl || 300;
        const expiry = Date.now() + (ttl * 1000);
        
        this.cache.set(cacheKey, {
          value: newValue,
          expiry
        });
        
        return newValue;
      });
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  async expire(key: string, ttl: number, options: CacheOptions = {}): Promise<void> {
    if (!this.isConnected) return;

    const cacheKey = this.generateKey(key, options.prefix);

    try {
      await this.measurePerformance(() => {
        const entry = this.cache.get(cacheKey);
        if (entry) {
          entry.expiry = Date.now() + (ttl * 1000);
          this.cache.set(cacheKey, entry);
        }
      });
    } catch (error) {
      console.error('Cache expire error:', error);
    }
  }

  // Vendor-specific caching methods
  async getVendors(filters: { category?: string; location?: string; search?: string }): Promise<any[] | null> {
    const cacheKey = `vendors:${JSON.stringify(filters)}`;
    return this.get<any[]>(cacheKey, { ttl: 300, prefix: 'vendors' }); // 5 minutes
  }

  async setVendors(filters: { category?: string; location?: string; search?: string }, vendors: any[]): Promise<void> {
    const cacheKey = `vendors:${JSON.stringify(filters)}`;
    await this.set(cacheKey, vendors, { ttl: 300, prefix: 'vendors' });
  }

  async getFeaturedVendors(): Promise<any[] | null> {
    return this.get<any[]>('featured', { ttl: 600, prefix: 'vendors' }); // 10 minutes
  }

  async setFeaturedVendors(vendors: any[]): Promise<void> {
    await this.set('featured', vendors, { ttl: 600, prefix: 'vendors' });
  }

  async getVendor(id: number): Promise<any | null> {
    return this.get<any>(`vendor:${id}`, { ttl: 1800, prefix: 'vendors' }); // 30 minutes
  }

  async setVendor(id: number, vendor: any): Promise<void> {
    await this.set(`vendor:${id}`, vendor, { ttl: 1800, prefix: 'vendors' });
  }

  async invalidateVendor(id: number): Promise<void> {
    await this.delete(`vendor:${id}`, { prefix: 'vendors' });
    // Also invalidate vendor lists that might contain this vendor
    await this.deletePattern('vendors:*', { prefix: 'vendors' });
  }

  async invalidateAllVendors(): Promise<void> {
    await this.deletePattern('*', { prefix: 'vendors' });
  }

  // Search-specific caching methods
  async getSearchResults(query: string, filters: any): Promise<any[] | null> {
    const cacheKey = `search:${query}:${JSON.stringify(filters)}`;
    return this.get<any[]>(cacheKey, { ttl: 1800, prefix: 'search' }); // 30 minutes
  }

  async setSearchResults(query: string, filters: any, results: any[]): Promise<void> {
    const cacheKey = `search:${query}:${JSON.stringify(filters)}`;
    await this.set(cacheKey, results, { ttl: 1800, prefix: 'search' });
  }

  // Cache statistics
  getStats(): CacheStats {
    const avgResponseTime = this.stats.responseTimes.length > 0
      ? this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length
      : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: this.stats.totalRequests > 0 ? (this.stats.hits / this.stats.totalRequests) * 100 : 0,
      avgResponseTime,
      totalRequests: this.stats.totalRequests
    };
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    if (!this.isConnected) {
      return {
        status: 'unhealthy',
        details: { error: 'Memory cache not connected' }
      };
    }

    try {
      const stats = this.getStats();
      const memoryUsage = process.memoryUsage();

      return {
        status: 'healthy',
        details: {
          cacheType: 'in-memory',
          cacheSize: this.cache.size,
          stats,
          memory: {
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
            external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
          }
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}

// Singleton instance
export const memoryCache = new MemoryCacheService();

// Export for use in other modules
export default memoryCache;