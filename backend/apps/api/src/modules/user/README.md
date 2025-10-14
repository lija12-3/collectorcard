# User Module

This module handles all user-related functionality in the API application.

## Structure

```
user/
├── dto/
│   ├── create-user.dto.ts    # DTO for creating users
│   ├── update-user.dto.ts    # DTO for updating users
│   ├── user-query.dto.ts     # DTO for querying users
│   └── index.ts              # DTO exports
├── user.controller.ts        # REST API endpoints
├── user.service.ts          # Business logic
├── user.module.ts           # Module definition
├── index.ts                 # Module exports
└── README.md               # This file
```

## Features

### User Entity Fields

- `email` (required, unique)
- `firstName` (optional)
- `nickName` (optional)
- `lastName` (optional)
- `dob` (date of birth, optional)
- `zipcode` (optional)
- `phoneNumber` (optional)
- Plus system fields (timestamps, verification status, etc.)

### API Endpoints

- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users` - List users with pagination and filtering
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `PUT /api/v1/users/:id/soft-delete` - Soft delete user
- `PUT /api/v1/users/:id/verify-email` - Verify user email
- `PUT /api/v1/users/:id/verify-phone` - Verify user phone
- `GET /api/v1/users/email/:email` - Get user by email
- `GET /api/v1/users/nickname/:nickName` - Get user by nickname

### DTOs

#### CreateUserDto

```typescript
{
  email: string;
  firstName?: string;
  nickName?: string;
  lastName?: string;
  dob?: Date;
  zipcode?: string;
  phoneNumber?: string;
  profileData?: Record<string, any>;
  preferences?: Record<string, any>;
}
```

#### UpdateUserDto

Extends CreateUserDto with additional fields:

```typescript
{
  ...CreateUserDto;
  isActive?: boolean;
}
```

#### UserQueryDto

```typescript
{
  page?: number;           // Default: 1
  limit?: number;          // Default: 10, Max: 100
  search?: string;         // Search across name fields
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}
```

## Usage

The module is automatically imported in the main AppModule and provides:

- Full CRUD operations
- Input validation
- Type safety
- Business logic encapsulation
- Database abstraction through BaseRepository

## Dependencies

- `@libs/database` - Database entities and base repository
- `@libs/authentication` - Authentication guards
- `class-validator` - DTO validation
- `class-transformer` - DTO transformation
