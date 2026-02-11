# Feedback Management System

A full-stack feedback management application with React frontend and Node.js/Express backend using SQLite database.

## Tech Stack

- **Frontend**: React, Framer Motion, Axios, React Router
- **Backend**: Node.js, Express
- **Database**: SQLite (file-based, no setup required)

## Project Structure

```
feedsys/
├── backend/
│   ├── config/
│   │   └── database.js          # SQLite connection and initialization
│   ├── controllers/
│   │   └── feedbackController.js # Feedback CRUD logic
│   ├── middleware/
│   │   └── apiTracker.js        # API tracking middleware
│   ├── routes/
│   │   └── feedbackRoutes.js    # API routes
│   ├── utils/
│   │   └── logger.js            # Logging utilities
│   ├── server.js                # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.js      # List all feedbacks
│   │   │   ├── AddFeedbackPage.js   # Add new feedback
│   │   │   └── EditFeedbackPage.js  # Edit feedback
│   │   ├── services/
│   │   │   └── api.js           # Axios API calls
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── README.md
```

## Local Development Setup

### Backend

```bash
cd backend
npm install
npm start
```

The backend runs on `http://localhost:5000`. SQLite database (`feedsys.db`) is created automatically.

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000`

## Database Schema

### feedbacks
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment primary key |
| title | TEXT | Feedback title |
| platform | TEXT | Platform (Web, Android, iOS) |
| module | TEXT | Module name |
| description | TEXT | Detailed description |
| attachments | TEXT | Attachment URLs/filenames |
| tags | TEXT | Comma-separated tags |
| status | TEXT | Status (New, In-Progress, In Review) |
| votes | INTEGER | Vote count |
| created_by | TEXT | Creator info |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

### logs (Activity Tracking - sorted by date_time)
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment primary key |
| activity | TEXT | Activity name |
| details | TEXT | Activity details |
| date_time | DATETIME | Activity timestamp |

### api_tracking (Request/Response Tracking)
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment primary key |
| api_endpoint | TEXT | API endpoint |
| request_method | TEXT | HTTP method |
| request_body | TEXT | Request payload |
| response_status | INTEGER | HTTP status code |
| response_body | TEXT | Response payload |
| date_time | DATETIME | Request timestamp |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/feedbacks | Fetch all feedbacks |
| POST | /api/feedbacks | Add new feedback |
| GET | /api/feedbacks/:id | Get specific feedback |
| PUT | /api/feedbacks/:id | Update feedback |
| DELETE | /api/feedbacks/:id | Delete feedback |
| POST | /api/feedbacks/:id/upvote | Upvote feedback |
| POST | /api/feedbacks/:id/downvote | Downvote feedback |
| GET | /api/logs | Get activity logs |
| GET | /api/api-tracking | Get API tracking data |
| GET | /health | Health check |

## Features

### Frontend (React.js)
- **Home Page**: List view of all feedbacks with title, platform, module, description, attachments, tags, and edit/delete buttons
- **Add Feedback Page**: Form with validation for all fields
- **Edit Feedback Page**: Pre-filled form for editing existing feedback
- React Router for navigation
- Axios for API calls
- Framer Motion animations
- Form validation (no empty required fields)

### Backend (Node.js)
- RESTful API with input validation
- Activity logging to logs table
- API request/response tracking
- Error handling

### Database (SQLite)
- File-based database (no setup required)
- Automatic table creation on startup
- Three tables: feedbacks, logs, api_tracking

## License

This project is created for educational purposes.

## Author

Created as part of Feedback Management System assignment.
