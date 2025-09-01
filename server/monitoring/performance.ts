/**
 * Performance monitoring for the Wedding Directory Platform
 */

export interface PerformanceStats {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  memoryUsage: {
    used: number;
    total: number;
  };
}

export class PerformanceMonitor {
  private requestCount = 0;
  private totalResponseTime = 0;
  private errorCount = 0;

  recordRequest(responseTime: number, hasError = false) {
    this.requestCount++;
    this.totalResponseTime += responseTime;
    if (hasError) {
      this.errorCount++;
    }
  }

  getStats(): PerformanceStats {
    const memoryUsage = process.memoryUsage();
    return {
      requestCount: this.requestCount,
      averageResponseTime: this.requestCount > 0 ? this.totalResponseTime / this.requestCount : 0,
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
      memoryUsage: {
        used: memoryUsage.heapUsed,
        total: memoryUsage.heapTotal,
      },
    };
  }
}

export function createPerformanceMiddleware(monitor: PerformanceMonitor) {
  return {
    requestTracker: (req: any, res: any, next: any) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        const hasError = res.statusCode >= 400;
        monitor.recordRequest(responseTime, hasError);
      });
      
      next();
    }
  };
}