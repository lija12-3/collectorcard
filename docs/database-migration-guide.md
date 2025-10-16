# Database Migration Guide

This guide explains how the database migration works and what it creates in the Collectors Card application.

## 📋 Migration Overview

**Migration File**: `Migration20251015162916_update-user-entity-structure.ts`  
**Purpose**: Creates a complete user management system with proper data types, relationships, and change tracking  
**Database**: PostgreSQL  

## 🚀 Running the Migration

### Prerequisites

1. **Database Connection**: Ensure port forwarding is active
   ```bash
   kubectl port-forward aurora-tcp-proxy-6c556c8d74-v4twm 3306:3306
   ```

2. **Environment Variables**: Set database connection details
   ```bash
   $env:DB_HOST="localhost"
   $env:DB_PORT="3306"  # or 5432
   $env:DB_USERNAME="dbadmin"
   $env:DB_PASSWORD="3*+(0m-C1sj+a^^bGLX6=#>ua|GqvQj-"
   $env:DB_DATABASE="appdb"
   $env:DB_TYPE="postgresql"
   $env:DB_SSL="false"
   ```

### Migration Commands

#### Run Migration (Forward)
```bash
npx mikro-orm migration:up --config=apps/api/mikro-orm.config.ts
```

#### Rollback Migration (Backward)
```bash
npx mikro-orm migration:down --config=apps/api/mikro-orm.config.ts
```

#### Check Migration Status
```bash
npx mikro-orm migration:list --config=apps/api/mikro-orm.config.ts
```

#### Check Pending Migrations
```bash
npx mikro-orm migration:pending --config=apps/api/mikro-orm.config.ts
```

## 🏗️ What the Migration Creates

### 1. Custom Enum Type

```sql
CREATE TYPE "user_status_enum" AS ENUM('active', 'inactive', 'deleted');
```

**Purpose**: Defines valid user status values  
**Values**: 
- `active` - User is active and can use the system
- `inactive` - User account is temporarily disabled
- `deleted` - User account is permanently deleted

### 2. Main User Table (`user_master`)

```sql
CREATE TABLE "user_master" (
  "user_id" varchar(255) NOT NULL,                    -- Primary key (UUID)
  "created_at" timestamptz NOT NULL,                  -- Account creation timestamp
  "updated_at" timestamptz NOT NULL,                  -- Last update timestamp
  "email" varchar(255) NOT NULL,                      -- User email address
  "first_name" varchar(255) NOT NULL,                 -- User's first name
  "last_name" varchar(255) NOT NULL,                  -- User's last name
  "nick_name" varchar(100) NULL,                      -- Optional nickname
  "dob" date NOT NULL,                                -- Date of birth
  "zipcode" varchar(20) NOT NULL,                     -- ZIP/postal code
  "is_email_verified" boolean NOT NULL DEFAULT false, -- Email verification status
  "email_verified_at" timestamptz NULL,               -- When email was verified
  "user_status" "user_status_enum" NOT NULL DEFAULT 'active', -- Current user status
  CONSTRAINT "user_master_pkey" PRIMARY KEY ("user_id")
);
```

**Key Features**:
- **Primary Key**: `user_id` (UUID string)
- **Timestamps**: Automatic creation and update tracking
- **Email**: Required and will be unique
- **Status**: Uses the custom enum with default 'active'
- **Verification**: Tracks email verification status and timestamp

### 3. Indexes and Constraints

```sql
-- Email index for faster lookups
CREATE INDEX "user_master_email_index" ON "user_master" ("email");

-- Unique email constraint
ALTER TABLE "user_master" 
ADD CONSTRAINT "user_master_email_unique" UNIQUE ("email");
```

**Benefits**:
- **Fast email lookups** via index
- **Prevents duplicate emails** via unique constraint
- **Optimized queries** for user authentication

### 4. User History Table (`user_history`)

```sql
CREATE TABLE "user_history" (
  "user_history_id" varchar(255) NOT NULL,            -- Primary key (UUID)
  "user_id" varchar(255) NOT NULL,                    -- User ID (for reference)
  "user_user_id" varchar(255) NOT NULL,               -- Foreign key to user_master
  "created_at" timestamptz NOT NULL,                  -- When change was made
  "updated_at" timestamptz NOT NULL,                  -- Last update timestamp
  "field_name" varchar(255) NOT NULL,                 -- Which field changed
  "field_value" text NOT NULL,                        -- Current field value
  "old_value" text NULL,                              -- Previous field value
  "new_value" text NULL,                              -- New field value
  CONSTRAINT "user_history_pkey" PRIMARY KEY ("user_history_id")
);
```

**Purpose**: Tracks all changes made to user data  
**Use Cases**:
- Audit trail for user modifications
- Data recovery and rollback
- Compliance and logging
- User activity tracking

### 5. Foreign Key Relationship

```sql
ALTER TABLE "user_history" 
ADD CONSTRAINT "user_history_user_user_id_foreign" 
FOREIGN KEY ("user_user_id") 
REFERENCES "user_master" ("user_id") 
ON UPDATE CASCADE;
```

**Benefits**:
- **Data integrity** - Ensures history records reference valid users
- **Cascade updates** - If user_id changes, history records update automatically
- **Referential integrity** - Prevents orphaned history records

### 6. Cleanup

```sql
-- Remove old users table if it exists
DROP TABLE IF EXISTS "users" CASCADE;
```

**Purpose**: Removes any existing `users` table to avoid conflicts

## 📊 Final Database Schema

After migration, your database will have this structure:

```
appdb (PostgreSQL Database)
├── Types
│   └── user_status_enum
│       ├── 'active'
│       ├── 'inactive'
│       └── 'deleted'
├── Tables
│   ├── user_master
│   │   ├── user_id (PK)
│   │   ├── email (UNIQUE, INDEXED)
│   │   ├── first_name
│   │   ├── last_name
│   │   ├── nick_name
│   │   ├── dob
│   │   ├── zipcode
│   │   ├── is_email_verified
│   │   ├── email_verified_at
│   │   ├── user_status (ENUM)
│   │   ├── created_at
│   │   └── updated_at
│   ├── user_history
│   │   ├── user_history_id (PK)
│   │   ├── user_id
│   │   ├── user_user_id (FK → user_master.user_id)
│   │   ├── field_name
│   │   ├── field_value
│   │   ├── old_value
│   │   ├── new_value
│   │   ├── created_at
│   │   └── updated_at
│   └── mikro_orm_migrations
│       └── (Migration tracking table)
└── Indexes
    ├── user_master_email_index
    └── user_master_email_unique
```

## 🔄 Migration Rollback

If you need to rollback the migration, the `down()` method will:

1. **Drop foreign key constraint** from user_history
2. **Recreate old users table** with original structure
3. **Drop new tables** (user_master, user_history)
4. **Remove enum type** (user_status_enum)

## 🎯 Benefits of This Migration

### Data Integrity
- **Foreign key constraints** ensure data relationships are valid
- **Unique constraints** prevent duplicate emails
- **Enum types** restrict status values to valid options

### Performance
- **Indexed email field** for fast user lookups
- **Optimized queries** for authentication and user management

### Audit Trail
- **Complete change tracking** via user_history table
- **Timestamp tracking** for all modifications
- **Field-level change logging**

### Scalability
- **UUID primary keys** for distributed systems
- **Proper indexing** for large datasets
- **Normalized structure** for efficient queries

## 🛠️ Troubleshooting

### Common Issues

#### 1. Migration Fails
```bash
# Check migration status
npx mikro-orm migration:list --config=apps/api/mikro-orm.config.ts

# Check for pending migrations
npx mikro-orm migration:pending --config=apps/api/mikro-orm.config.ts
```

#### 2. Database Connection Issues
```bash
# Verify port forwarding
netstat -an | findstr :3306

# Test connection
node test-db-connection-comprehensive.js
```

#### 3. Permission Issues
- Ensure database user has CREATE, ALTER, and DROP permissions
- Check if user can create custom types and tables

### Manual Override

If you need to bypass migration checks:
```bash
# Skip migration validation (use with caution)
npx mikro-orm migration:up --config=apps/api/mikro-orm.config.ts --fake
```

## 📝 Next Steps

After running the migration:

1. **Verify tables exist**:
   ```sql
   \dt user_master
   \dt user_history
   ```

2. **Test data insertion**:
   ```sql
   INSERT INTO user_master (user_id, email, first_name, last_name, dob, zipcode)
   VALUES ('test-uuid', 'test@example.com', 'John', 'Doe', '1990-01-01', '12345');
   ```

3. **Test history tracking**:
   ```sql
   INSERT INTO user_history (user_history_id, user_id, user_user_id, field_name, field_value)
   VALUES ('history-uuid', 'test-uuid', 'test-uuid', 'email', 'test@example.com');
   ```

---

**Last Updated**: January 2025  
**Maintained by**: Collectors Card Team  
**Migration Version**: 20251015162916
