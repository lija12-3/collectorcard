# BFF Service API Documentation

The Backend for Frontend (BFF) service provides a unified API for frontend applications, aggregating data from multiple microservices into optimized responses.

## Base URL

```
Development: http://localhost:3000
Production: https://api.cardinal.com
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

### Dashboard

#### GET /api/v1/dashboard

Get aggregated dashboard data including user profile, recent payments, and notifications.

**Request:**
```http
GET /api/v1/dashboard
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
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
    "recentPayments": [
      {
        "id": "payment-123",
        "amount": 99.99,
        "currency": "USD",
        "status": "completed",
        "paymentMethod": "card",
        "description": "Monthly subscription",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "recentNotifications": [
      {
        "id": "notification-123",
        "type": "email",
        "title": "Payment Successful",
        "message": "Your payment of $99.99 has been processed",
        "status": "sent",
        "readAt": null,
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "stats": {
      "totalPayments": 10,
      "totalAmount": 999.90,
      "unreadNotifications": 3
    }
  },
  "message": "Dashboard data retrieved successfully"
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

### Payments

#### GET /api/v1/payments

Get the current user's payment history.

**Request:**
```http
GET /api/v1/payments
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
      "id": "payment-123",
      "amount": 99.99,
      "currency": "USD",
      "status": "completed",
      "paymentMethod": "card",
      "description": "Monthly subscription",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": "payment-124",
      "amount": 49.99,
      "currency": "USD",
      "status": "pending",
      "paymentMethod": "bank_transfer",
      "description": "One-time purchase",
      "createdAt": "2023-01-02T00:00:00.000Z"
    }
  ],
  "message": "Payment history retrieved successfully"
}
```

#### POST /api/v1/payments

Create a new payment.

**Request:**
```http
POST /api/v1/payments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 99.99,
  "currency": "USD",
  "paymentMethod": "card",
  "description": "Monthly subscription",
  "metadata": {
    "subscriptionId": "sub-123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "payment-125",
    "amount": 99.99,
    "currency": "USD",
    "status": "pending",
    "paymentMethod": "card",
    "description": "Monthly subscription",
    "createdAt": "2023-01-03T00:00:00.000Z"
  },
  "message": "Payment created successfully"
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

## Webhooks

The BFF service can send webhooks for certain events:

**Webhook Events:**
- `payment.completed`
- `payment.failed`
- `notification.sent`
- `user.updated`

**Webhook Payload:**
```json
{
  "event": "payment.completed",
  "data": {
    "paymentId": "payment-123",
    "amount": 99.99,
    "currency": "USD"
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
class CardinalAPI {
  constructor(private baseURL: string, private token: string) {}

  async getDashboard() {
    const response = await fetch(`${this.baseURL}/api/v1/dashboard`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  async updateProfile(profileData: any) {
    const response = await fetch(`${this.baseURL}/api/v1/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    return response.json();
  }
}
```

### Python

```python
import requests

class CardinalAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def get_dashboard(self):
        response = requests.get(
            f'{self.base_url}/api/v1/dashboard',
            headers=self.headers
        )
        return response.json()

    def update_profile(self, profile_data):
        response = requests.patch(
            f'{self.base_url}/api/v1/profile',
            headers=self.headers,
            json=profile_data
        )
        return response.json()
```

## Testing

### Postman Collection

Import the Cardinal BFF API Postman collection for easy testing:

[Download Collection](postman/cardinal-bff-api.json)

### cURL Examples

```bash
# Health check
curl -X GET http://localhost:3000/api/v1/health

# Get dashboard (requires authentication)
curl -X GET http://localhost:3000/api/v1/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update profile
curl -X PATCH http://localhost:3000/api/v1/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName": "John", "lastName": "Smith"}'
```
