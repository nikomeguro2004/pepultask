# Feedback Management System - Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## API Endpoints

### Feedbacks

#### 1. Get All Feedbacks
- **Endpoint:** `GET /feedbacks`
- **Description:** Retrieve all feedback records
- **Response:** 
  ```json
  [
    {
      "id": 1,
      "title": "Bug in Login",
      "platform": "Web",
      "module": "Authentication",
      "description": "Login fails with special characters",
      "attachments": "screenshot.png",
      "tags": "bug, critical",
      "created_at": "2026-02-11T10:00:00.000Z",
      "updated_at": "2026-02-11T10:00:00.000Z"
    }
  ]
  ```

#### 2. Get Feedback by ID
- **Endpoint:** `GET /feedbacks/:id`
- **Description:** Retrieve a specific feedback by ID
- **Response:** Same as single feedback object above

#### 3. Create New Feedback
- **Endpoint:** `POST /feedbacks`
- **Description:** Create a new feedback record
- **Request Body:**
  ```json
  {
    "title": "Bug in Login",
    "platform": "Web",
    "module": "Authentication",
    "description": "Login fails with special characters",
    "attachments": "screenshot.png",
    "tags": "bug, critical"
  }
  ```
- **Response:** Created feedback object with ID
- **Validation:** title, platform, module, and description are required

#### 4. Update Feedback
- **Endpoint:** `PUT /feedbacks/:id`
- **Description:** Update an existing feedback
- **Request Body:** Same as create endpoint
- **Response:** Updated feedback object

#### 5. Delete Feedback
- **Endpoint:** `DELETE /feedbacks/:id`
- **Description:** Delete a feedback record
- **Response:**
  ```json
  {
    "message": "Feedback deleted successfully"
  }
  ```

### Logs and Tracking

#### 6. Get Activity Logs
- **Endpoint:** `GET /logs`
- **Description:** Retrieve all activity logs sorted by date/time
- **Response:**
  ```json
  [
    {
      "id": 1,
      "activity": "CREATE_FEEDBACK",
      "details": "Created new feedback: Bug in Login",
      "date_time": "2026-02-11T10:00:00.000Z"
    }
  ]
  ```

#### 7. Get API Tracking
- **Endpoint:** `GET /api-tracking`
- **Description:** Retrieve all API request/response tracking data
- **Response:**
  ```json
  [
    {
      "id": 1,
      "api_endpoint": "/api/feedbacks",
      "request_method": "POST",
      "request_body": "{\"title\":\"Bug in Login\"}",
      "response_status": 201,
      "response_body": "{\"id\":1}",
      "date_time": "2026-02-11T10:00:00.000Z"
    }
  ]
  ```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Title, platform, module, and description are required"
}
```

### 404 Not Found
```json
{
  "error": "Feedback not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch feedbacks"
}
```

## Database Tables

### feedbacks
- id (INT, Primary Key, Auto Increment)
- title (VARCHAR)
- platform (VARCHAR)
- module (VARCHAR)
- description (TEXT)
- attachments (VARCHAR)
- tags (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### logs
- id (INT, Primary Key, Auto Increment)
- activity (VARCHAR)
- details (TEXT)
- date_time (TIMESTAMP)

### api_tracking
- id (INT, Primary Key, Auto Increment)
- api_endpoint (VARCHAR)
- request_method (VARCHAR)
- request_body (TEXT)
- response_status (INT)
- response_body (TEXT)
- date_time (TIMESTAMP)

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure database:
   - Copy `.env.example` to `.env`
   - Update database credentials

3. Start server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. Server will run on http://localhost:5000
