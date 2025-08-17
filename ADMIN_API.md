# Admin API Documentation

## Overview

The admin functionality allows creating users with specific roles using better-auth's admin plugin. The system supports the following roles:

- **patient** (default)
- **admin**
- **dentist** 
- **secretary**

## API Endpoints

### Create User

**POST** `/api/admin/users`

Creates a new user with the specified role.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "secure-password-123",
  "name": "John Doe",
  "role": "patient",
  "data": {
    "customField": "customValue"
  }
}
```

#### Required Fields

- `email`: Valid email address
- `password`: Minimum 8 characters
- `name`: User's full name

#### Optional Fields

- `role`: One of `patient`, `admin`, `dentist`, `secretary` (defaults to `patient`)
- `data`: Additional custom data as key-value pairs

#### Response

**Success (201)**
```json
{
  "success": true,
  "data": {
    "id": "user_12345",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "patient",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "User created successfully"
}
```

**Error (400)**
```json
{
  "success": false,
  "error": "Invalid email format",
  "message": "User creation failed"
}
```

### Health Check

**GET** `/api/admin/health`

Returns the health status of the admin service.

#### Response

```json
{
  "status": "ok",
  "service": "admin-controller",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Example Usage

### Using curl

```bash
# Create a patient
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "securepass123",
    "name": "Jane Patient",
    "role": "patient"
  }'

# Create an admin
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepass123",
    "name": "John Admin",
    "role": "admin"
  }'

# Create a dentist
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dentist@example.com",
    "password": "securepass123",
    "name": "Dr. Smith",
    "role": "dentist"
  }'
```

### Using JavaScript/TypeScript

```typescript
import { auth } from '@/auth'

const createUser = async () => {
  const newUser = await auth.api.createUser({
    body: {
      email: "user@example.com",
      password: "secure-password-123",
      name: "John Doe",
      role: "patient",
      data: { customField: "customValue" },
    },
  });
  
  console.log('User created:', newUser);
}
```

## Architecture

The admin functionality follows a layered architecture:

1. **Routes** (`/src/server/routes/adminRoutes.ts`) - HTTP route definitions
2. **Controllers** (`/src/server/controllers/admin.controller.ts`) - Request/response handling
3. **Services** (`/src/server/services/admin.service.ts`) - Business logic and validation
4. **Auth Integration** - Uses better-auth admin plugin for user creation

## Security Notes

- Passwords are automatically hashed by better-auth
- Input validation is performed using Zod schemas
- Custom roles are stored in user data fields to work with better-auth constraints
- All API responses follow a consistent format with success/error handling

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: Invalid input data (email format, password length, etc.)
- **Auth Errors**: Issues with better-auth user creation
- **Server Errors**: Unexpected server-side errors

All errors return a consistent format with `success: false`, an error message, and appropriate HTTP status codes.
