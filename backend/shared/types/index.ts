// Common types used across Cardinal microservices

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ServiceConfig {
  name: string;
  version: string;
  port: number;
  environment: 'development' | 'staging' | 'production';
  region: string;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  aws: {
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  encryption: {
    key: string;
  };
}

export interface UserContext {
  userId: string;
  email: string;
  roles: string[];
  groups: string[];
  permissions?: string[];
}

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

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

export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  conditions: Record<string, any>;
  actions: string[];
  priority: number;
  active: boolean;
}
