# API Documentation

## Base URL

```
Development: http://localhost:3000
Production: https://api.collectorscard.com
```

## Authentication

All endpoints (except health check) require JWT authentication:

```http
Authorization: Bearer <jwt_token>
```

## Response Format

All responses follow a standardized format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Endpoints

### Health Check

#### GET /api/v1/health

Check if the BFF service is healthy.

**Request:**
```http
GET /api/v1/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "service": "bff-service",
    "status": "healthy",
    "timestamp": "2023-01-01T00:00:00.000Z",
    "version": "1.0.0"
  },
  "message": "BFF service is healthy"
}
```

### User Profile

#### GET /api/v1/profile

Get the current user's profile information.

**Request:**
```http
GET /api/v1/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "isActive": true,
    "isEmailVerified": true,
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US"
    },
    "preferences": {
      "theme": "dark",
      "notifications": true
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "User profile retrieved successfully"
}
```

#### PATCH /api/v1/profile

Update the current user's profile information.

**Request:**
```http
PATCH /api/v1/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210",
    "country": "US"
  },
  "preferences": {
    "theme": "light",
    "notifications": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phoneNumber": "+1234567890",
    "isActive": true,
    "isEmailVerified": true,
    "address": {
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90210",
      "country": "US"
    },
    "preferences": {
      "theme": "light",
      "notifications": false
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  },
  "message": "User profile updated successfully"
}
```

### Notifications

#### GET /api/v1/notifications

Get the current user's notifications.

**Request:**
```http
GET /api/v1/notifications
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notification-123",
      "type": "email",
      "title": "Payment Successful",
      "message": "Your payment of $99.99 has been processed",
      "status": "sent",
      "readAt": null,
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": "notification-124",
      "type": "push",
      "title": "New Feature Available",
      "message": "Check out our new dashboard features",
      "status": "delivered",
      "readAt": "2023-01-01T12:00:00.000Z",
      "createdAt": "2023-01-01T06:00:00.000Z"
    }
  ],
  "message": "Notifications retrieved successfully"
}
```

#### PATCH /api/v1/notifications/:id/read

Mark a notification as read.

**Request:**
```http
PATCH /api/v1/notifications/notification-123/read
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": true,
  "message": "Notification marked as read"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Missing or invalid authentication token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `SERVICE_UNAVAILABLE` | Downstream service unavailable |
| `AGGREGATION_ERROR` | Error aggregating data from services |
| `INTERNAL_SERVER_ERROR` | Internal server error |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Rate Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers
- **Exceeded**: Returns `429 Too Many Requests` when limit exceeded

## Caching

Some endpoints implement caching for performance:

- **Dashboard**: Cached for 5 minutes
- **User Profile**: Cached for 30 minutes
- **Payments**: Cached for 2 minutes
- **Notifications**: Cached for 1 minute

Cache headers are included in responses:
- `Cache-Control`: Cache control directives
- `ETag`: Entity tag for cache validation
- `Last-Modified`: Last modification time

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (starts from 1)
- `limit`: Items per page (max 100)

**Response Headers:**
- `X-Total-Count`: Total number of items
- `X-Page-Count`: Total number of pages
- `X-Current-Page`: Current page number
- `X-Per-Page`: Items per page
