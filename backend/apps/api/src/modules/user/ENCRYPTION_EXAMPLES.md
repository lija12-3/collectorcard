# Encryption/Decryption Examples in User Controller

This document demonstrates how to use the `@Encrypt` and `@Decrypt` decorators in the User Controller for handling sensitive data.

## Overview

The `@Encrypt` and `@Decrypt` decorators are parameter decorators that automatically handle encryption and decryption of sensitive data in NestJS controllers.

## Available Endpoints

### 1. Create User with Sensitive Data

**POST** `/api/v1/users/sensitive-data`

Creates a user with encrypted sensitive information.

**Request Body:**

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "nickName": "johndoe",
  "dob": "1990-01-01",
  "zipcode": "12345",
  "ssn": "123-45-6789",
  "creditCardNumber": "4111-1111-1111-1111",
  "bankAccountNumber": "1234567890"
}
```

**Response:**

```json
{
  "message": "User created with encrypted sensitive data",
  "user": {
    /* user object */
  },
  "encryptedFields": {
    "ssn": "***-***-6789",
    "creditCard": "****-****-****-1111",
    "bankAccount": "****7890"
  },
  "encryptedData": {
    /* encrypted versions */
  },
  "note": "Sensitive data has been encrypted and stored securely"
}
```

### 2. Get User with Decrypted Sensitive Data

**GET** `/api/v1/users/sensitive-data/:id`

Retrieves a user with decrypted sensitive information.

**Response:**

```json
{
  "message": "User retrieved with decrypted sensitive data",
  "user": {
    /* user object with decrypted sensitive data */
  },
  "decryptedData": {
    /* decrypted versions */
  },
  "warning": "Sensitive data is only decrypted for authorized access"
}
```

### 3. Update User with Encryption/Decryption

**PUT** `/api/v1/users/sensitive-data/:id`

Updates a user with both encryption and decryption handling.

**Request Body:** Same as create endpoint

**Response:**

```json
{
  "message": "Sensitive data updated with encryption/decryption",
  "user": {
    /* updated user object */
  },
  "processedSensitiveData": {
    /* masked sensitive data */
  },
  "encryptedData": {
    /* encrypted versions */
  },
  "decryptedData": {
    /* decrypted versions */
  },
  "encryptionStatus": {
    "ssn": "encrypted",
    "creditCard": "encrypted",
    "bankAccount": "encrypted"
  }
}
```

### 4. Field-Level Encryption Demo

**POST** `/api/v1/users/field-encryption-demo`

Demonstrates field-level encryption concepts.

**Request Body:**

```json
{
  "email": "demo@example.com",
  "ssn": "123-45-6789",
  "creditCard": "4111-1111-1111-1111"
}
```

**Response:**

```json
{
  "message": "Field-level encryption demonstration",
  "originalData": {
    "email": "demo@example.com",
    "ssn": "123-45-6789",
    "creditCard": "4111-1111-1111-1111"
  },
  "encryptedFields": {
    "ssn": "encrypted_ssn_6789",
    "creditCard": "encrypted_card_1111"
  },
  "usage": {
    "@Encrypt()": "Applied to DTO fields to automatically encrypt sensitive data",
    "@Decrypt()": "Applied to DTO fields to automatically decrypt data when retrieving",
    "Security": "Uses AES-256-GCM encryption with unique IVs for each field"
  }
}
```

## How the Decorators Work

### @Encrypt Decorator

- **Type:** Parameter Decorator
- **Usage:** `@Encrypt(['field1', 'field2']) encryptedData?: any`
- **Purpose:** Automatically encrypts specified fields from the request body
- **Returns:** Object containing encrypted versions of the specified fields

### @Decrypt Decorator

- **Type:** Parameter Decorator
- **Usage:** `@Decrypt(['field1', 'field2']) decryptedData?: any`
- **Purpose:** Automatically decrypts specified fields from the database
- **Returns:** Object containing decrypted versions of the specified fields

## Security Features

1. **AES-256-GCM Encryption:** Uses industry-standard encryption
2. **Unique IVs:** Each field gets a unique initialization vector
3. **Automatic Processing:** No manual encryption/decryption needed
4. **Field-Level Control:** Specify exactly which fields to encrypt/decrypt
5. **Type Safety:** Full TypeScript support

## DTOs

### SensitiveUserDto

Contains fields for sensitive user data that should be encrypted:

- `ssn?: string`
- `creditCardNumber?: string`
- `bankAccountNumber?: string`

### DecryptUserDto

Contains fields for retrieving decrypted sensitive data:

- Same fields as SensitiveUserDto but designed for decryption

## Best Practices

1. **Use HTTPS:** Always use HTTPS in production
2. **Key Management:** Store encryption keys securely (AWS KMS, Azure Key Vault, etc.)
3. **Field Selection:** Only encrypt truly sensitive data
4. **Access Control:** Implement proper authorization for sensitive endpoints
5. **Audit Logging:** Log access to sensitive data
6. **Data Masking:** Mask sensitive data in logs and responses

## Environment Variables

Make sure to set the encryption key in your environment:

```env
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

## Error Handling

The decorators will throw errors if:

- Encryption key is not provided
- Invalid encrypted data format
- Decryption fails

Handle these errors appropriately in your application.
