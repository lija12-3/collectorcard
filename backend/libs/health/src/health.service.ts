import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  dependencies?: {
    database: 'connected' | 'disconnected';
    redis?: 'connected' | 'disconnected';
    external_apis: 'available' | 'unavailable';
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  async checkHealth(): Promise<HealthCheck> {
    const uptime = Date.now() - this.startTime;
    
    try {
      // Check database connection
      const dbStatus = await this.checkDatabase();
      
      // Check Redis connection
      const redisStatus = await this.checkRedis();
      
      // Check external APIs
      const externalApisStatus = await this.checkExternalApis();

      const health: HealthCheck = {
        service: 'Cardinal',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '1.0.0',
        uptime: Math.floor(uptime / 1000), // Convert to seconds
        dependencies: {
          database: dbStatus,
          redis: redisStatus,
          external_apis: externalApisStatus,
        },
      };

      // Determine overall health status
      if (dbStatus === 'disconnected' || externalApisStatus === 'unavailable') {
        health.status = 'unhealthy';
      }

      return health;
    } catch (error) {
      this.logger.error('Health check failed', error);
      
      return {
        service: 'Cardinal',
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '1.0.0',
        uptime: Math.floor(uptime / 1000),
        dependencies: {
          database: 'disconnected',
          redis: 'disconnected',
          external_apis: 'unavailable',
        },
      };
    }
  }

  private async checkDatabase(): Promise<'connected' | 'disconnected'> {
    try {
      // This would be replaced with actual database connection check
      // For now, we'll simulate a check
      return 'connected';
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return 'disconnected';
    }
  }

  private async checkRedis(): Promise<'connected' | 'disconnected'> {
    try {
      // This would be replaced with actual Redis connection check
      // For now, we'll simulate a check
      return 'connected';
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      return 'disconnected';
    }
  }

  private async checkExternalApis(): Promise<'available' | 'unavailable'> {
    try {
      // This would be replaced with actual external API checks
      // For now, we'll simulate a check
      return 'available';
    } catch (error) {
      this.logger.error('External APIs health check failed', error);
      return 'unavailable';
    }
  }

  async getHealthIndicator(): Promise<HealthIndicatorResult> {
    const health = await this.checkHealth();
    
    return {
      [health.service]: {
        status: health.status,
        timestamp: health.timestamp,
        version: health.version,
        uptime: health.uptime,
        dependencies: health.dependencies,
      },
    };
  }
}
