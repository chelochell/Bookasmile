# Clinic Branch API Documentation

## Overview
This document describes the clinic branch management API endpoints added to the admin section.

## Base URL
All endpoints are prefixed with `/api/admin`

## Endpoints

### 1. Create Clinic Branch
**POST** `/api/admin/clinic-branches`

Creates a new clinic branch.

#### Request Body
```json
{
  "name": "Main Branch",
  "address": "123 Main Street, City, State 12345",
  "phone": "+1-555-123-4567",
  "email": "main@clinic.com"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "clx123abc456",
    "name": "Main Branch",
    "address": "123 Main Street, City, State 12345",
    "phone": "+1-555-123-4567",
    "email": "main@clinic.com"
  },
  "message": "Clinic branch created successfully"
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Clinic branch with this email already exists",
  "message": "Email must be unique"
}
```

### 2. Get All Clinic Branches
**GET** `/api/admin/clinic-branches`

Retrieves all clinic branches ordered by name.

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc456",
      "name": "Main Branch",
      "address": "123 Main Street, City, State 12345",
      "phone": "+1-555-123-4567",
      "email": "main@clinic.com"
    },
    {
      "id": "clx789def012",
      "name": "North Branch",
      "address": "456 North Ave, City, State 67890",
      "phone": "+1-555-987-6543",
      "email": "north@clinic.com"
    }
  ],
  "message": "Clinic branches retrieved successfully"
}
```

### 3. Get Clinic Branch by ID
**GET** `/api/admin/clinic-branches/:id`

Retrieves a specific clinic branch by its ID.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "clx123abc456",
    "name": "Main Branch",
    "address": "123 Main Street, City, State 12345",
    "phone": "+1-555-123-4567",
    "email": "main@clinic.com"
  },
  "message": "Clinic branch retrieved successfully"
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "error": "Clinic branch not found",
  "message": "No clinic branch found with this ID"
}
```

## Validation Rules

### Create Clinic Branch
- **name**: Required, minimum 1 character
- **address**: Required, minimum 1 character
- **phone**: Required, minimum 1 character
- **email**: Required, must be a valid email format, must be unique

## Example Usage

### Using curl

```bash
# Create a new clinic branch
curl -X POST http://localhost:3000/api/admin/clinic-branches \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Branch",
    "address": "789 Downtown St, City, State 11111",
    "phone": "+1-555-111-2222",
    "email": "downtown@clinic.com"
  }'

# Get all clinic branches
curl -X GET http://localhost:3000/api/admin/clinic-branches

# Get specific clinic branch
curl -X GET http://localhost:3000/api/admin/clinic-branches/clx123abc456
```

### Using JavaScript/Fetch

```javascript
// Create clinic branch
const createBranch = async () => {
  const response = await fetch('/api/admin/clinic-branches', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Downtown Branch',
      address: '789 Downtown St, City, State 11111',
      phone: '+1-555-111-2222',
      email: 'downtown@clinic.com'
    })
  });
  
  const result = await response.json();
  console.log(result);
};

// Get all branches
const getAllBranches = async () => {
  const response = await fetch('/api/admin/clinic-branches');
  const result = await response.json();
  console.log(result);
};
```

## Database Schema
The clinic branch data is stored in the `clinic_branch` table with the following structure:

```sql
CREATE TABLE "clinic_branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "clinic_branch_pkey" PRIMARY KEY ("id")
);
```

## Error Handling
All endpoints return consistent error responses with the following structure:

```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Internal Server Error
