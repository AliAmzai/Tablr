# Tablr API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except signup/login) require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Sign Up
Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response (400):**
```json
{
  "error": "User already exists"
}
```

---

### 2. Login
Login with email and password.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 3. Get Current User
Get the authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": null
}
```

**Error Response (401):**
```json
{
  "error": "Invalid token"
}
```

---

## Reservation Endpoints

### 1. Create Reservation
Create a new reservation for the authenticated user.

**Endpoint:** `POST /reservations`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Meeting with Client",
  "description": "Discuss project requirements",
  "startTime": "2026-02-05T10:00:00Z",
  "endTime": "2026-02-05T11:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "message": "Reservation created successfully",
  "reservation": {
    "id": 1,
    "userId": 1,
    "title": "Meeting with Client",
    "description": "Discuss project requirements",
    "startTime": "2026-02-05T10:00:00.000Z",
    "endTime": "2026-02-05T11:00:00.000Z",
    "status": "confirmed",
    "createdAt": "2026-02-01T19:10:00.000Z",
    "updatedAt": "2026-02-01T19:10:00.000Z"
  }
}
```

---

### 2. Get All Reservations
Get all reservations for the authenticated user.

**Endpoint:** `GET /reservations`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "Meeting with Client",
    "description": "Discuss project requirements",
    "startTime": "2026-02-05T10:00:00.000Z",
    "endTime": "2026-02-05T11:00:00.000Z",
    "status": "confirmed",
    "createdAt": "2026-02-01T19:10:00.000Z",
    "updatedAt": "2026-02-01T19:10:00.000Z"
  },
  {
    "id": 2,
    "userId": 1,
    "title": "Doctor Appointment",
    "description": "Annual checkup",
    "startTime": "2026-02-06T14:00:00.000Z",
    "endTime": "2026-02-06T15:00:00.000Z",
    "status": "confirmed",
    "createdAt": "2026-02-01T19:11:00.000Z",
    "updatedAt": "2026-02-01T19:11:00.000Z"
  }
]
```

---

### 3. Get Single Reservation
Get a specific reservation by ID.

**Endpoint:** `GET /reservations/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:** `GET /reservations/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "title": "Meeting with Client",
  "description": "Discuss project requirements",
  "startTime": "2026-02-05T10:00:00.000Z",
  "endTime": "2026-02-05T11:00:00.000Z",
  "status": "confirmed",
  "createdAt": "2026-02-01T19:10:00.000Z",
  "updatedAt": "2026-02-01T19:10:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Reservation not found"
}
```

---

### 4. Update Reservation
Update an existing reservation.

**Endpoint:** `PUT /reservations/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "title": "Updated Meeting Title",
  "description": "Updated description",
  "startTime": "2026-02-05T11:00:00Z",
  "endTime": "2026-02-05T12:00:00Z",
  "status": "cancelled"
}
```

**Response (200 OK):**
```json
{
  "message": "Reservation updated successfully",
  "reservation": {
    "id": 1,
    "userId": 1,
    "title": "Updated Meeting Title",
    "description": "Updated description",
    "startTime": "2026-02-05T11:00:00.000Z",
    "endTime": "2026-02-05T12:00:00.000Z",
    "status": "cancelled",
    "createdAt": "2026-02-01T19:10:00.000Z",
    "updatedAt": "2026-02-01T19:12:00.000Z"
  }
}
```

---

### 5. Delete Reservation
Delete a reservation.

**Endpoint:** `DELETE /reservations/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:** `DELETE /reservations/1`

**Response (200 OK):**
```json
{
  "message": "Reservation deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Reservation not found"
}
```

---

## Restaurant Endpoints

### 1. Get User's Restaurant
Get the authenticated user's restaurant with all floors and tables.

**Endpoint:** `GET /restaurants`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "My Restaurant",
  "userId": 1,
  "shareToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-01T10:00:00.000Z",
  "floors": [
    {
      "id": 1,
      "name": "Floor 1",
      "floorNumber": 1,
      "restaurantId": 1,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z",
      "tables": [
        {
          "id": 1,
          "name": "T1",
          "shape": "round",
          "capacity": 4,
          "status": "available",
          "x": 20.5,
          "y": 30.2,
          "width": 8.0,
          "height": 8.0,
          "floorId": 1,
          "createdAt": "2026-02-01T10:00:00.000Z",
          "updatedAt": "2026-02-01T10:00:00.000Z"
        }
      ]
    }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "Restaurant not found"
}
```

---

### 2. Create Restaurant
Create a new restaurant for the authenticated user (if they don't have one).

**Endpoint:** `POST /restaurants`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "My Restaurant"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "My Restaurant",
  "userId": 1,
  "shareToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-01T10:00:00.000Z",
  "floors": [
    {
      "id": 1,
      "name": "Floor 1",
      "floorNumber": 1,
      "restaurantId": 1,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z",
      "tables": []
    }
  ]
}
```

**Error Response (400):**
```json
{
  "error": "Restaurant already exists"
}
```

---

### 3. Update Restaurant
Update the authenticated user's restaurant name.

**Endpoint:** `PUT /restaurants`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Restaurant Name"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Restaurant Name",
  "userId": 1,
  "shareToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-01T10:05:00.000Z",
  "floors": [...]
}
```

---

## Floor Endpoints

### 1. Get All Floors
Get all floors for the authenticated user's restaurant.

**Endpoint:** `GET /floors`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Floor 1",
    "floorNumber": 1,
    "restaurantId": 1,
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z",
    "tables": [
      {
        "id": 1,
        "name": "T1",
        "shape": "round",
        "capacity": 4,
        "status": "available",
        "x": 20.5,
        "y": 30.2,
        "width": 8.0,
        "height": 8.0,
        "floorId": 1
      }
    ]
  },
  {
    "id": 2,
    "name": "Floor 2",
    "floorNumber": 2,
    "restaurantId": 1,
    "createdAt": "2026-02-01T11:00:00.000Z",
    "updatedAt": "2026-02-01T11:00:00.000Z",
    "tables": []
  }
]
```

**Error Response (404):**
```json
{
  "error": "Restaurant not found"
}
```

---

### 2. Get Single Floor
Get a specific floor by ID with all its tables.

**Endpoint:** `GET /floors/:floorId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:** `GET /floors/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Floor 1",
  "floorNumber": 1,
  "restaurantId": 1,
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-01T10:00:00.000Z",
  "tables": [
    {
      "id": 1,
      "name": "T1",
      "shape": "round",
      "capacity": 4,
      "status": "available",
      "x": 20.5,
      "y": 30.2,
      "width": 8.0,
      "height": 8.0,
      "floorId": 1
    }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "Floor not found"
}
```

---

### 3. Create Floor
Create a new floor for the authenticated user's restaurant.

**Endpoint:** `POST /floors`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Floor 2"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "Floor 2",
  "floorNumber": 2,
  "restaurantId": 1,
  "createdAt": "2026-02-01T11:00:00.000Z",
  "updatedAt": "2026-02-01T11:00:00.000Z",
  "tables": []
}
```

**Error Response (404):**
```json
{
  "error": "Restaurant not found"
}
```

---

### 4. Update Floor
Update a floor's name.

**Endpoint:** `PUT /floors/:floorId`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Main Floor"
}
```

**Example:** `PUT /floors/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Main Floor",
  "floorNumber": 1,
  "restaurantId": 1,
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-01T11:30:00.000Z",
  "tables": [...]
}
```

---

### 5. Delete Floor
Delete a floor and all its tables.

**Endpoint:** `DELETE /floors/:floorId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:** `DELETE /floors/2`

**Response (200 OK):**
```json
{
  "message": "Floor deleted successfully"
}
```

**Error Response (500):**
```json
{
  "error": "Internal server error"
}
```

---

## Table Endpoints

### 1. Get All Tables for a Floor
Get all tables for a specific floor.

**Endpoint:** `GET /tables/floor/:floorId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:** `GET /tables/floor/1`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "T1",
    "shape": "round",
    "capacity": 4,
    "status": "available",
    "x": 20.5,
    "y": 30.2,
    "width": 8.0,
    "height": 8.0,
    "floorId": 1,
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "T2",
    "shape": "square",
    "capacity": 2,
    "status": "occupied",
    "x": 45.0,
    "y": 25.0,
    "width": 8.0,
    "height": 8.0,
    "floorId": 1,
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z"
  }
]
```

---

### 2. Create Table
Create a new table on a floor.

**Endpoint:** `POST /tables`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "floorId": 1,
  "name": "T1",
  "shape": "round",
  "capacity": 4,
  "status": "available",
  "x": 20.5,
  "y": 30.2,
  "width": 8.0,
  "height": 8.0
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "T1",
  "shape": "round",
  "capacity": 4,
  "status": "available",
  "x": 20.5,
  "y": 30.2,
  "width": 8.0,
  "height": 8.0,
  "floorId": 1,
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-01T10:00:00.000Z"
}
```

**Field Descriptions:**
- `floorId` (required): ID of the floor where the table will be placed
- `name` (required): Name/label for the table (e.g., "T1", "Table 1")
- `shape` (required): Shape of the table ("round", "square", or "rectangle")
- `capacity` (required): Number of seats at the table
- `status` (optional): Table status ("available", "occupied", "reserved") - defaults to "available"
- `x` (required): X coordinate on the floor plan (percentage)
- `y` (required): Y coordinate on the floor plan (percentage)
- `width` (required): Width of the table on the floor plan
- `height` (required): Height of the table on the floor plan

---

### 3. Update Table
Update an existing table's properties.

**Endpoint:** `PUT /tables/:tableId`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "name": "T1-Updated",
  "shape": "square",
  "capacity": 6,
  "status": "reserved",
  "x": 25.0,
  "y": 35.0,
  "width": 10.0,
  "height": 10.0
}
```

**Example:** `PUT /tables/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "T1-Updated",
  "shape": "square",
  "capacity": 6,
  "status": "reserved",
  "x": 25.0,
  "y": 35.0,
  "width": 10.0,
  "height": 10.0,
  "floorId": 1,
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-01T12:00:00.000Z"
}
```

---

### 4. Delete Table
Delete a table from a floor.

**Endpoint:** `DELETE /tables/:tableId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:** `DELETE /tables/1`

**Response (200 OK):**
```json
{
  "message": "Table deleted successfully"
}
```

**Error Response (500):**
```json
{
  "error": "Internal server error"
}
```

---

## Health Check
**Endpoint:** `GET /health`

**Response (200 OK):**
```json
{
  "status": "Server is running!"
}
```

---

## Error Handling

All errors follow this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Server Error

---

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Create Reservation
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Reservation",
    "description": "Test reservation",
    "startTime": "2026-02-05T10:00:00Z",
    "endTime": "2026-02-05T11:00:00Z"
  }'
```

### Get All Reservations
```bash
curl -X GET http://localhost:5000/api/reservations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Restaurant
```bash
curl -X GET http://localhost:5000/api/restaurants \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Restaurant
```bash
curl -X POST http://localhost:5000/api/restaurants \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Restaurant"
  }'
```

### Create Floor
```bash
curl -X POST http://localhost:5000/api/floors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Floor 2"
  }'
```

### Get All Floors
```bash
curl -X GET http://localhost:5000/api/floors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Table
```bash
curl -X POST http://localhost:5000/api/tables \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "floorId": 1,
    "name": "T1",
    "shape": "round",
    "capacity": 4,
    "status": "available",
    "x": 20.5,
    "y": 30.2,
    "width": 8.0,
    "height": 8.0
  }'
```

### Get Tables for Floor
```bash
curl -X GET http://localhost:5000/api/tables/floor/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Table
```bash
curl -X PUT http://localhost:5000/api/tables/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "occupied"
  }'
```

---

---

## Employee Endpoints

### 1. Get All Employees for a Restaurant
Get all employees for a specific restaurant.

**Endpoint:** `GET /employees?restaurantId={restaurantId}`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `restaurantId` (required): ID of the restaurant

**Example:** `GET /employees?restaurantId=1`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "restaurantId": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "role": "waiter",
    "createdAt": "2026-02-03T10:00:00.000Z",
    "updatedAt": "2026-02-03T10:00:00.000Z",
    "tables": [
      {
        "id": 1,
        "name": "T1"
      },
      {
        "id": 2,
        "name": "T2"
      }
    ]
  },
  {
    "id": 2,
    "restaurantId": 1,
    "name": "Jane Doe",
    "email": null,
    "phone": "+1 (555) 987-6543",
    "role": "chef",
    "createdAt": "2026-02-03T11:00:00.000Z",
    "updatedAt": "2026-02-03T11:00:00.000Z",
    "tables": []
  }
]
```

**Error Response (404):**
```json
{
  "error": "Restaurant not found"
}
```

---

### 2. Get Single Employee
Get details of a specific employee.

**Endpoint:** `GET /employees/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:** `GET /employees/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "restaurantId": 1,
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "role": "waiter",
  "createdAt": "2026-02-03T10:00:00.000Z",
  "updatedAt": "2026-02-03T10:00:00.000Z",
  "restaurant": {
    "id": 1,
    "name": "My Restaurant",
    "userId": 1
  },
  "tables": [
    {
      "id": 1,
      "name": "T1",
      "capacity": 4
    }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "Employee not found"
}
```

---

### 3. Create Employee
Create a new employee for a restaurant.

**Endpoint:** `POST /employees`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "restaurantId": 1,
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "role": "waiter"
}
```

**Field Descriptions:**
- `restaurantId` (required): ID of the restaurant
- `name` (required): Employee's full name
- `email` (optional): Employee's email address
- `phone` (optional): Employee's phone number
- `role` (optional): Employee role - defaults to "waiter". Common values: "waiter", "chef", "manager", "host", "bartender"

**Response (201 Created):**
```json
{
  "id": 1,
  "restaurantId": 1,
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "role": "waiter",
  "createdAt": "2026-02-03T10:00:00.000Z",
  "updatedAt": "2026-02-03T10:00:00.000Z",
  "tables": []
}
```

**Error Response (400):**
```json
{
  "error": "Restaurant ID and name are required"
}
```

**Error Response (404):**
```json
{
  "error": "Restaurant not found"
}
```

---

### 4. Update Employee
Update an existing employee's information.

**Endpoint:** `PUT /employees/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "name": "John Smith Jr.",
  "email": "john.smith@example.com",
  "phone": "+1 (555) 999-8888",
  "role": "manager"
}
```

**Example:** `PUT /employees/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "restaurantId": 1,
  "name": "John Smith Jr.",
  "email": "john.smith@example.com",
  "phone": "+1 (555) 999-8888",
  "role": "manager",
  "createdAt": "2026-02-03T10:00:00.000Z",
  "updatedAt": "2026-02-03T12:30:00.000Z",
  "tables": [
    {
      "id": 1,
      "name": "T1"
    }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "Employee not found"
}
```

---

### 5. Delete Employee
Delete an employee from a restaurant.

**Endpoint:** `DELETE /employees/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:** `DELETE /employees/1`

**Response (200 OK):**
```json
{
  "message": "Employee deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Employee not found"
}
```

---

## Updated Restaurant Endpoints

### Note on Multiple Restaurants
Users can now create and manage multiple restaurants. The following endpoints have been updated:

### 1. Get User's Restaurants
Get all restaurants for the authenticated user, or a specific one by ID.

**Endpoint:** `GET /restaurants` or `GET /restaurants?id={restaurantId}`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `id` (optional): Specific restaurant ID to retrieve

**Response (200 OK) - All Restaurants:**
```json
[
  {
    "id": 1,
    "name": "My Restaurant",
    "description": "Fine dining experience",
    "contactEmail": "contact@restaurant.com",
    "contactPhone": "+1 (555) 000-0000",
    "userId": 1,
    "shareToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z",
    "floors": [...],
    "employees": [...],
    "locations": [...]
  }
]
```

**Response (200 OK) - Single Restaurant:**
```json
{
  "id": 1,
  "name": "My Restaurant",
  "description": "Fine dining experience",
  "contactEmail": "contact@restaurant.com",
  "contactPhone": "+1 (555) 000-0000",
  "userId": 1,
  "shareToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-01T10:00:00.000Z",
  "floors": [...],
  "employees": [...],
  "locations": [...]
}
```

---

### 2. Create Restaurant
Create a new restaurant (users can now have multiple).

**Endpoint:** `POST /restaurants`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "My New Restaurant",
  "description": "A cozy bistro",
  "contactEmail": "info@bistro.com",
  "contactPhone": "+1 (555) 111-2222"
}
```

**Field Descriptions:**
- `name` (required): Restaurant name
- `description` (optional): Brief description
- `contactEmail` (optional): Contact email
- `contactPhone` (optional): Contact phone

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "My New Restaurant",
  "description": "A cozy bistro",
  "contactEmail": "info@bistro.com",
  "contactPhone": "+1 (555) 111-2222",
  "userId": 1,
  "shareToken": "x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6",
  "createdAt": "2026-02-03T10:00:00.000Z",
  "updatedAt": "2026-02-03T10:00:00.000Z",
  "floors": [
    {
      "id": 1,
      "name": "Floor 1",
      "floorNumber": 1,
      "restaurantId": 2,
      "tables": []
    }
  ],
  "employees": [],
  "locations": []
}
```

---

### 3. Update Restaurant
Update a specific restaurant by ID.

**Endpoint:** `PUT /restaurants/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "name": "Updated Restaurant Name",
  "description": "Updated description",
  "contactEmail": "new@email.com",
  "contactPhone": "+1 (555) 333-4444"
}
```

**Example:** `PUT /restaurants/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Restaurant Name",
  "description": "Updated description",
  "contactEmail": "new@email.com",
  "contactPhone": "+1 (555) 333-4444",
  "userId": 1,
  "shareToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-03T11:00:00.000Z",
  "floors": [...],
  "employees": [...],
  "locations": [...]
}
```

---

### 4. Delete Restaurant
Delete a specific restaurant by ID.

**Endpoint:** `DELETE /restaurants/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:** `DELETE /restaurants/1`

**Response (200 OK):**
```json
{
  "message": "Restaurant deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Restaurant not found"
}
```

---

## Updated Table Endpoints

### Worker Assignment
Tables can now be assigned to employees (workers) for tracking purposes.

### 1. Get All Tables for a Floor
Get all tables for a specific floor (now includes worker information).

**Endpoint:** `GET /tables/floor/:floorId`

**Response includes worker data:**
```json
[
  {
    "id": 1,
    "name": "T1",
    "shape": "round",
    "capacity": 4,
    "status": "available",
    "x": 20.5,
    "y": 30.2,
    "width": 8.0,
    "height": 8.0,
    "floorId": 1,
    "workerId": 1,
    "worker": {
      "id": 1,
      "name": "John Smith",
      "role": "waiter"
    },
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z"
  }
]
```

---

### 2. Create Table with Worker Assignment
Create a new table on a floor with optional worker assignment.

**Endpoint:** `POST /tables`

**Request Body:**
```json
{
  "floorId": 1,
  "name": "T1",
  "shape": "round",
  "capacity": 4,
  "status": "available",
  "x": 20.5,
  "y": 30.2,
  "width": 8.0,
  "height": 8.0,
  "workerId": 1
}
```

**Field Descriptions:**
- `workerId` (optional): ID of the employee to assign to this table

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "T1",
  "shape": "round",
  "capacity": 4,
  "status": "available",
  "x": 20.5,
  "y": 30.2,
  "width": 8.0,
  "height": 8.0,
  "floorId": 1,
  "workerId": 1,
  "worker": {
    "id": 1,
    "name": "John Smith",
    "role": "waiter"
  },
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-01T10:00:00.000Z"
}
```

---

### 3. Update Table
Update table properties including worker assignment.

**Endpoint:** `PUT /tables/:tableId`

**Request Body** (all fields optional):
```json
{
  "name": "T1-Updated",
  "workerId": 2
}
```

**Note:** To remove worker assignment, set `workerId` to `null`

**Response includes updated worker data:**
```json
{
  "id": 1,
  "name": "T1-Updated",
  "shape": "round",
  "capacity": 4,
  "status": "available",
  "x": 20.5,
  "y": 30.2,
  "width": 8.0,
  "height": 8.0,
  "floorId": 1,
  "workerId": 2,
  "worker": {
    "id": 2,
    "name": "Jane Doe",
    "role": "waiter"
  },
  "createdAt": "2026-02-01T10:00:00.000Z",
  "updatedAt": "2026-02-03T12:00:00.000Z"
}
```

---

## Testing with cURL

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "role": "waiter"
  }'
```

### Get All Employees
```bash
curl -X GET "http://localhost:5000/api/employees?restaurantId=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Employee
```bash
curl -X PUT http://localhost:5000/api/employees/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith Jr.",
    "role": "manager"
  }'
```

### Delete Employee
```bash
curl -X DELETE http://localhost:5000/api/employees/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Restaurant
```bash
curl -X POST http://localhost:5000/api/restaurants \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Restaurant",
    "description": "A cozy bistro"
  }'
```

### Create Table with Worker
```bash
curl -X POST http://localhost:5000/api/tables \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "floorId": 1,
    "name": "T1",
    "shape": "round",
    "capacity": 4,
    "status": "available",
    "x": 20.5,
    "y": 30.2,
    "width": 8.0,
    "height": 8.0,
    "workerId": 1
  }'
```

---

## Notes
- Timestamps are in ISO 8601 format (UTC)
- JWT tokens expire after 7 days (configurable in .env)
- Reservation times are stored in UTC and converted to the user's timezone on the frontend
- Each user can only access their own reservations
- Users can now have multiple restaurants
- A restaurant is automatically created with an initial floor when first created
- Floor numbers are automatically assigned sequentially starting from 1
- Table positions (x, y) are stored as percentages of the floor plan dimensions
- Table shapes can be: "round", "square", or "rectangle"
- Table statuses can be: "available", "occupied", or "reserved"
- Employee roles can be: "waiter", "chef", "manager", "host", "bartender", or custom values
- Worker assignment to tables is optional
- When an employee is deleted, tables assigned to them will have workerId set to null
- All restaurant, floor, table, and employee endpoints require authentication
- Share tokens are automatically generated when creating a restaurant
