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

---

## Notes
- Timestamps are in ISO 8601 format (UTC)
- JWT tokens expire after 7 days (configurable in .env)
- Reservation times are stored in UTC and converted to the user's timezone on the frontend
- Each user can only access their own reservations
