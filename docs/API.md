# RoleWithAI API Documentation

## Overview

RoleWithAI provides a RESTful API for interacting with the platform's features. All API endpoints are prefixed with `/api/v1`.

## Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### User Management

#### Get Current User
```http
GET /api/v1/user/me
```

Response:
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Update User Profile
```http
PATCH /api/v1/user/me
```

Request:
```json
{
  "name": "string",
  "bio": "string",
  "skills": ["string"],
  "interests": ["string"]
}
```

### Career Roadmap

#### Get Career Roadmap
```http
GET /api/v1/roadmap
```

Response:
```json
{
  "currentRole": "string",
  "targetRole": "string",
  "milestones": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "string",
      "skills": ["string"]
    }
  ]
}
```

#### Update Career Goals
```http
PATCH /api/v1/roadmap/goals
```

Request:
```json
{
  "targetRole": "string",
  "timeline": "string",
  "preferences": {
    "learningStyle": "string",
    "timeCommitment": "string"
  }
}
```

### Skills

#### Get Skills Assessment
```http
GET /api/v1/skills/assessment
```

Response:
```json
{
  "skills": [
    {
      "name": "string",
      "level": "number",
      "confidence": "number",
      "lastAssessed": "string"
    }
  ]
}
```

#### Update Skill Level
```http
PATCH /api/v1/skills/{skillId}
```

Request:
```json
{
  "level": "number",
  "confidence": "number"
}
```

### Learning Resources

#### Get Recommended Resources
```http
GET /api/v1/resources
```

Query Parameters:
- `skill`: Filter by skill
- `level`: Filter by difficulty level
- `type`: Filter by resource type

Response:
```json
{
  "resources": [
    {
      "id": "string",
      "title": "string",
      "type": "string",
      "url": "string",
      "description": "string",
      "skills": ["string"],
      "level": "string"
    }
  ]
}
```

### AI Mentor

#### Get AI Guidance
```http
POST /api/v1/mentor/chat
```

Request:
```json
{
  "message": "string",
  "context": {
    "currentRole": "string",
    "targetRole": "string",
    "skills": ["string"]
  }
}
```

Response:
```json
{
  "response": "string",
  "suggestions": ["string"],
  "resources": ["string"]
}
```

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Common error codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1619123456
``` 