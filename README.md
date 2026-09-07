# Student Performance Dashboard Backend

Node.js backend for the Student Performance Dashboard.

## Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- CommonJS modules

## Requirements

- Node.js 18 or newer
- MongoDB running locally on port `27017`

## Setup

From this directory, install dependencies:

```bash
npm install
```

Create a file named `.env` directly inside the `backend/` folder. This file is ignored by Git, so each local setup must create its own copy with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/student_performance_db
```

## Run The Backend

Start the server:

```bash
npm start
```

Start with automatic restart during development:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

## Seed Mock Data

The seed script clears the existing `students`, `subjects`, and `performances` collections, then inserts mock data:

- 5 students
- 6 subjects
- 30 performance records

Run it with:

```bash
npm run seed
```

## Project Structure

```text
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── performanceController.js
│   └── studentController.js
├── middleware/
│   └── errorHandler.js
├── models/
│   ├── Performance.js
│   ├── Student.js
│   └── Subject.js
├── routes/
│   ├── performanceRoutes.js
│   └── studentRoutes.js
├── services/
│   ├── performanceService.js
│   └── studentService.js
├── sockets/
│   └── socket.js
├── utils/
│   └── gradeCalculator.js
├── seed.js
└── server.js
```

## REST API

### Get Student Summary

```http
GET /api/students/:registerNumber
```

Example:

```text
GET http://localhost:5000/api/students/22CS101
```

Returns student details, calculated summary values, and all performance records. Total marks, grades, average marks, attendance averages, and pass/fail status are calculated by the backend and are not stored in performance documents.

### Get Student Performance

```http
GET /api/students/:registerNumber/performance
```

Supported query parameters:

- `page`, default `1`
- `limit`, default `3`
- `sortBy`: `subjectName`, `internalMark`, `externalMark`, `total`, `attendance`, or `grade`
- `order`: `asc` or `desc`
- `grade`: `A+`, `A`, `B+`, `B`, `C`, `D`, or `F`
- `minAttendance`: minimum attendance percentage

Example:

```text
GET http://localhost:5000/api/students/22CS101/performance?page=1&limit=3&sortBy=total&order=desc
```

### Update Performance

```http
PUT /api/performances/:performanceId
Content-Type: application/json
```

Request body:

```json
{
  "internalMark": 30,
  "externalMark": 55,
  "attendance": 92
}
```

Validation limits:

- `internalMark`: `0` to `40`
- `externalMark`: `0` to `60`
- `attendance`: `0` to `100`

The response includes calculated `total` and `grade`. These calculated values are not persisted in MongoDB.

## Real-Time Updates

Socket.IO uses the same HTTP server as Express. Clients connect to:

```text
http://localhost:5000
```

After a performance update succeeds, the backend emits:

```text
performanceUpdated
```

Payload:

```json
{
  "registerNumber": "22CS101",
  "message": "Student performance updated"
}
```

## Architecture

Requests follow this flow:

```text
Route -> Controller -> Service -> Mongoose Model -> MongoDB
```

Unexpected errors are passed to the centralized error handler, which returns consistent JSON responses such as:

```json
{
  "success": false,
  "message": "Internal server error"
}
```
