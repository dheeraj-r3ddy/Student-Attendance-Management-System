# Student Attendance Management System - Complete Full Stack Project

## Overview

This is a complete full-stack Student Attendance Management System with:

**Frontend**: React + JavaScript + HTML + CSS (Tailwind)
**Backend**: Java + Spring Boot + PostgreSQL/MySQL

## Project Structure

```
student-attendance-system/
├── frontend/                    # React Frontend (current Figma Make project)
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/          # All page components
│   │   │   ├── components/     # Reusable components
│   │   │   ├── context/        # State management
│   │   │   ├── routes.tsx      # Routing configuration
│   │   │   └── App.tsx         # Main app component
│   │   └── styles/             # CSS and Tailwind styles
│   └── package.json
│
└── backend/                     # Spring Boot Backend
    ├── src/
    │   ├── main/
    │   │   ├── java/com/attendance/
    │   │   │   ├── controller/  # REST API Controllers
    │   │   │   ├── service/     # Business Logic
    │   │   │   ├── repository/  # Database Access
    │   │   │   ├── model/       # Database Entities
    │   │   │   ├── dto/         # Data Transfer Objects
    │   │   │   ├── security/    # JWT & Security
    │   │   │   └── config/      # Configuration
    │   │   └── resources/
    │   │       ├── application.properties
    │   │       └── schema.sql
    │   └── test/
    └── pom.xml                  # Maven dependencies
```

## Features

### 1. Authentication System
- Secure login with JWT tokens
- Role-based access (Admin/Faculty)
- Protected routes
- Session management

### 2. Student Management
- Add new students
- Edit student details
- Delete students
- Search functionality
- View all students

### 3. Attendance Marking
- Select class, subject, and date
- Mark multiple students as present/absent
- Visual attendance interface
- Real-time statistics

### 4. Attendance Reports
- Filter by student, subject, class, date range
- Student-wise attendance percentage
- Overall attendance statistics
- Detailed records view

### 5. Dashboard
- Quick statistics overview
- Recent attendance records
- Navigation to all features
- User profile display

## Technology Stack

### Frontend
- **React 18**: UI framework
- **React Router**: Navigation and routing
- **Tailwind CSS v4**: Styling
- **Lucide React**: Icons
- **Vite**: Build tool
- **TypeScript**: Type safety

### Backend
- **Java 17**: Programming language
- **Spring Boot 3.2**: Framework
- **Spring Security**: Authentication & Authorization
- **Spring Data JPA**: ORM
- **JWT**: Token-based authentication
- **PostgreSQL/MySQL**: Database
- **Maven**: Build tool
- **Lombok**: Code simplification

## Setup Instructions

### Part 1: Backend Setup

#### Step 1: Install Prerequisites
```bash
# Install Java 17
# Download from: https://adoptium.net/

# Install Maven
# Download from: https://maven.apache.org/download.cgi

# Install PostgreSQL
# Download from: https://www.postgresql.org/download/
```

#### Step 2: Create Database
```bash
# PostgreSQL
createdb attendance_db

# Or using psql
psql -U postgres
CREATE DATABASE attendance_db;
\q
```

#### Step 3: Configure Backend
Navigate to `/backend/src/main/resources/application.properties` and update:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/attendance_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Secret (change this!)
jwt.secret=your-super-secret-key-change-in-production

# CORS (update with your frontend URL)
cors.allowed-origins=http://localhost:5173
```

#### Step 4: Build and Run Backend
```bash
# Navigate to backend folder
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Backend will start at: `http://localhost:8080`

### Part 2: Frontend Setup (Already Done!)

The frontend is already built and running in Figma Make. To connect it to your backend, you'll need to update the API calls.

## Connecting Frontend to Backend

### Current State
The frontend uses mock data stored in React Context (`/src/app/context/AppContext.tsx`).

### To Connect to Real Backend

You need to modify the Context to make API calls instead of using local state. Here's how:

#### Step 1: Create API Service

Create `/src/app/services/api.ts`:

```typescript
const API_URL = 'http://localhost:8080/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API call wrapper
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};

// Students API
export const studentsAPI = {
  getAll: (search?: string) =>
    apiCall(`/students${search ? `?search=${search}` : ''}`),
  create: (student: any) =>
    apiCall('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    }),
  update: (id: string, student: any) =>
    apiCall(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    }),
  delete: (id: string) =>
    apiCall(`/students/${id}`, { method: 'DELETE' }),
};

// Attendance API
export const attendanceAPI = {
  mark: (records: any[]) =>
    apiCall('/attendance', {
      method: 'POST',
      body: JSON.stringify({ records }),
    }),
  getRecords: (filters: any) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/attendance/records?${params}`);
  },
  getStudentWiseReport: (filters: any) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/attendance/reports/student-wise?${params}`);
  },
};
```

#### Step 2: Update AppContext

Modify `/src/app/context/AppContext.tsx` to use the API:

```typescript
import { authAPI, studentsAPI, attendanceAPI } from '../services/api';

// Update login function
const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await authAPI.login(username, password);
    if (response.success) {
      setUser({
        username: response.user.username,
        role: response.user.role,
      });
      localStorage.setItem('token', response.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

// Update addStudent function
const addStudent = async (student: Omit<Student, 'id'>) => {
  try {
    const response = await studentsAPI.create(student);
    if (response.success) {
      // Refresh students list
      loadStudents();
    }
  } catch (error) {
    console.error('Failed to add student:', error);
  }
};

// Similar updates for other functions...
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Students
- `GET /api/students` - Get all students (with optional search)
- `GET /api/students/{id}` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/records` - Get attendance records (with filters)
- `GET /api/attendance/reports/student-wise` - Get student-wise report
- `GET /api/attendance/subjects` - Get distinct subjects
- `GET /api/attendance/classes` - Get distinct classes

## Default Credentials

| Username | Password    | Role    |
|----------|-------------|---------|
| admin    | admin123    | Admin   |
| faculty  | faculty123  | Faculty |

**⚠️ Important: Change these in production!**

## Database Schema

### Users Table
```sql
- id (BIGSERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- password (VARCHAR) - BCrypt hashed
- role (VARCHAR) - ADMIN or FACULTY
- created_at (TIMESTAMP)
```

### Students Table
```sql
- id (BIGSERIAL PRIMARY KEY)
- name (VARCHAR)
- department (VARCHAR)
- year (VARCHAR)
- section (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Attendance Records Table
```sql
- id (BIGSERIAL PRIMARY KEY)
- student_id (BIGINT FK)
- student_name (VARCHAR)
- subject (VARCHAR)
- class (VARCHAR)
- date (DATE)
- status (VARCHAR) - PRESENT or ABSENT
- created_at (TIMESTAMP)
- UNIQUE(student_id, subject, class, date)
```

## Testing the Application

### 1. Test Backend API with Curl

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Save the token from response and use it:

# Get Students
curl -X GET http://localhost:8080/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create Student
curl -X POST http://localhost:8080/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "department": "Computer Science",
    "year": "1st Year",
    "section": "A"
  }'
```

### 2. Test Frontend

The frontend is already running. To test:

1. Open the application
2. Login with: `admin` / `admin123`
3. Navigate through:
   - Dashboard
   - Manage Students
   - Mark Attendance
   - View Reports

## Deployment

### Backend Deployment

#### Option 1: Deploy to Heroku
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### Option 2: Deploy to AWS EC2
1. Launch EC2 instance
2. Install Java 17
3. Install PostgreSQL
4. Upload JAR file
5. Run: `java -jar attendance-backend-1.0.0.jar`

#### Option 3: Docker
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/attendance-backend-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Frontend Deployment

The frontend can be deployed through Figma Make's deployment options, or you can build and deploy separately:

```bash
# Build for production
npm run build

# Deploy to Vercel, Netlify, or any static hosting
```

## Security Best Practices

1. ✅ **Change default passwords**
2. ✅ **Use HTTPS in production**
3. ✅ **Update JWT secret to a strong random string**
4. ✅ **Configure CORS to allow only your domain**
5. ✅ **Enable rate limiting**
6. ✅ **Use environment variables for secrets**
7. ✅ **Regular security audits**
8. ✅ **Keep dependencies updated**

## Common Issues & Solutions

### Issue: CORS Error
**Solution**: Update `cors.allowed-origins` in `application.properties` to include your frontend URL.

### Issue: Database Connection Failed
**Solution**: Check database is running and credentials are correct in `application.properties`.

### Issue: JWT Token Expired
**Solution**: Login again to get a new token. Default expiration is 24 hours.

### Issue: Port Already in Use
**Solution**: Change port in `application.properties`: `server.port=8081`

## File Locations

### Backend Files
All backend files are in the `/backend/` folder:
- `pom.xml` - Maven configuration
- `src/main/java/com/attendance/` - Java source code
- `src/main/resources/` - Configuration files
- `README.md` - Backend documentation

### Frontend Files
Frontend is the current Figma Make project:
- `/src/app/pages/` - All page components
- `/src/app/context/AppContext.tsx` - State management
- `/src/app/routes.tsx` - Routing configuration

## Next Steps

1. ✅ Backend is fully implemented (check `/backend/` folder)
2. ✅ Frontend is fully implemented (already running)
3. 🔄 Connect frontend to backend (create API service)
4. 🔄 Test end-to-end functionality
5. 🔄 Deploy to production

## Support & Documentation

- **Backend README**: `/backend/README.md`
- **API Documentation**: Detailed in backend README
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React Docs**: https://react.dev/

## License

This project is for educational purposes.

---

**Your complete full-stack Student Attendance Management System is ready!** 🎉

The backend code is in the `/backend/` folder, and the frontend is already running in Figma Make.
