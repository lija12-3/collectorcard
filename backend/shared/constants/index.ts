// Common constants used across Cardinal microservices

export const CARDINAL_CONSTANTS = {
  // Service Names
  SERVICES: {
    USER: 'user-service',
    PAYMENT: 'payment-service',
    NOTIFICATION: 'notification-service',
    CONTENT: 'content-service',
    ANALYTICS: 'analytics-service',
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  // Database
  DATABASE: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    DEFAULT_SORT_ORDER: 'DESC',
  },

  // JWT
  JWT: {
    DEFAULT_EXPIRES_IN: '1h',
    REFRESH_EXPIRES_IN: '7d',
    ALGORITHM: 'HS256',
  },

  // Encryption
  ENCRYPTION: {
    ALGORITHM: 'aes-256-gcm',
    KEY_LENGTH: 32,
    IV_LENGTH: 16,
    SALT_ROUNDS: 10,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },

  // Cache
  CACHE: {
    DEFAULT_TTL: 300, // 5 minutes
    USER_TTL: 1800, // 30 minutes
    SESSION_TTL: 3600, // 1 hour
  },

  // AWS
  AWS: {
    DEFAULT_REGION: 'us-east-1',
    SQS_VISIBILITY_TIMEOUT: 30,
    SQS_MESSAGE_RETENTION: 1209600, // 14 days
  },

  // Notification
  NOTIFICATION: {
    BATCH_SIZE: 100,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },

  // Payment
  PAYMENT: {
    CURRENCIES: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 1000000,
  },

  // Logging
  LOGGING: {
    LEVELS: ['error', 'warn', 'info', 'debug', 'verbose'],
    DEFAULT_LEVEL: 'info',
    MAX_FILE_SIZE: '20m',
    MAX_FILES: '14d',
  },
} as const;

export const ERROR_CODES = {
  // Authentication & Authorization
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',

  // Validation
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',

  // Database
  DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',
  DATABASE_QUERY_FAILED: 'DATABASE_QUERY_FAILED',
  DATABASE_RECORD_NOT_FOUND: 'DATABASE_RECORD_NOT_FOUND',
  DATABASE_DUPLICATE_RECORD: 'DATABASE_DUPLICATE_RECORD',

  // External Services
  EXTERNAL_SERVICE_UNAVAILABLE: 'EXTERNAL_SERVICE_UNAVAILABLE',
  EXTERNAL_SERVICE_TIMEOUT: 'EXTERNAL_SERVICE_TIMEOUT',
  EXTERNAL_SERVICE_INVALID_RESPONSE: 'EXTERNAL_SERVICE_INVALID_RESPONSE',

  // Business Logic
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  NOTIFICATION_FAILED: 'NOTIFICATION_FAILED',

  // System
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
} as const;
