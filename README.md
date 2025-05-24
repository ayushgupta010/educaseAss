# School Management API

A Node.js API for managing schools with location-based sorting functionality.

## Features

- Add new schools with location data
- List schools sorted by proximity to a given location
- Input validation
- Error handling
- MySQL database integration

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=school_management
   PORT=3000
   ```
4. Set up the database:
   - Run the SQL commands in `src/database/schema.sql` in your MySQL server

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Add School
- **URL**: `/api/addSchool`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.9716,
    "longitude": 77.5946
  }
  ```

### List Schools
- **URL**: `/api/listSchools`
- **Method**: `GET`
- **Query Parameters**:
  - `latitude`: User's latitude
  - `longitude`: User's longitude
- **Example**: `/api/listSchools?latitude=12.9716&longitude=77.5946`

## Postman Collection

Import the following collection into Postman:

```json
{
  "info": {
    "name": "School Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Add School",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/addSchool",
        "body": {
          "mode": "raw",
          "raw": "{\n    \"name\": \"Example School\",\n    \"address\": \"123 School Street\",\n    \"latitude\": 12.9716,\n    \"longitude\": 77.5946\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        }
      }
    },
    {
      "name": "List Schools",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/listSchools",
        "query": [
          {
            "key": "latitude",
            "value": "12.9716"
          },
          {
            "key": "longitude",
            "value": "77.5946"
          }
        ]
      }
    }
  ]
}
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid input data
- Database errors
- Server errors

All error responses follow the format:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
``` 