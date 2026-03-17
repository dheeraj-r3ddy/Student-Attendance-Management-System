# Student Attendance Management System - Spring Boot Backend

## Technology Stack

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Spring Security**: JWT Authentication
- **Spring Data JPA**: Database ORM
- **PostgreSQL/MySQL**: Database
- **Maven**: Build Tool
- **Lombok**: Code Generation

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 14+ or MySQL 8+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## Setup Instructions

### 1. Database Setup

#### PostgreSQL (Recommended)
```bash
# Create database
createdb attendance_db

# Or using psql
psql -U postgres
CREATE DATABASE attendance_db;
```

#### MySQL (Alternative)
```sql
CREATE DATABASE attendance_db;
```

### 2. Configure Application Properties

Edit `src/main/resources/application.properties`:

```properties
# Update database credentials
spring.datasource.username=your_username
spring.datasource.password=your_password

# Update JWT secret (use a strong secret in production)
jwt.secret=your-super-secret-jwt-key-here

# Update allowed origins for CORS
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### 3. Build and Run

```bash
# Clean and build
mvn clean install

# Run the application
mvn spring-boot:run

# Or run the JAR file
java -jar target/attendance-backend-1.0.0.jar
```

The backend server will start at `http://localhost:8080`

## API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Students Management

#### Get All Students
```http
GET /api/students?search=john
Authorization: Bearer {token}

Response:
{
  "success": true,
  "students": [
    {
      "id": 1,
      "name": "John Smith",
      "department": "Computer Science",
      "year": "3rd Year",
      "section": "A"
    }
  ]
}
```

#### Create Student
```http
POST /api/students
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "department": "Computer Science",
  "year": "3rd Year",
  "section": "A"
}

Response:
{
  "success": true,
  "student": { ... },
  "message": "Student created successfully"
}
```

#### Update Student
```http
PUT /api/students/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith Updated",
  "department": "Computer Science",
  "year": "4th Year",
  "section": "A"
}
```

#### Delete Student
```http
DELETE /api/students/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Student deleted successfully"
}
```

### Attendance Management

#### Mark Attendance
```http
POST /api/attendance
Authorization: Bearer {token}
Content-Type: application/json

{
  "records": [
    {
      "studentId": 1,
      "studentName": "John Smith",
      "subject": "Data Structures",
      "className": "3rd Year CS-A",
      "date": "2026-03-17",
      "status": "present"
    }
  ]
}

Response:
{
  "success": true,
  "message": "Attendance marked successfully",
  "recordsCreated": 1
}
```

#### Get Attendance Records
```http
GET /api/attendance/records?studentName=john&subject=Data%20Structures&startDate=2026-03-01&endDate=2026-03-31
Authorization: Bearer {token}

Response:
{
  "success": true,
  "records": [...],
  "statistics": {
    "totalRecords": 100,
    "totalPresent": 85,
    "overallPercentage": 85
  }
}
```

#### Get Student-wise Report
```http
GET /api/attendance/reports/student-wise?subject=Data%20Structures
Authorization: Bearer {token}

Response:
{
  "success": true,
  "studentStats": [
    {
      "studentId": 1,
      "name": "John Smith",
      "total": 20,
      "present": 18,
      "percentage": 90
    }
  ]
}
```

## Default Users

The system comes with two default users:

| Username | Password    | Role    |
|----------|-------------|---------|
| admin    | admin123    | ADMIN   |
| faculty  | faculty123  | FACULTY |

**Important**: Change these credentials in production!

## Project Structure

```
src/main/java/com/attendance/
├── AttendanceApplication.java       # Main application class
├── config/
│   ├── SecurityConfig.java          # Security configuration
│   └── CorsConfig.java              # CORS configuration
├── controller/
│   ├── AuthController.java          # Authentication endpoints
│   ├── StudentController.java       # Student CRUD endpoints
│   └── AttendanceController.java    # Attendance endpoints
├── model/
│   ├── User.java                    # User entity
│   ├── Student.java                 # Student entity
│   └── AttendanceRecord.java        # Attendance entity
├── repository/
│   ├── UserRepository.java          # User data access
│   ├── StudentRepository.java       # Student data access
│   └── AttendanceRepository.java    # Attendance data access
├── service/
│   ├── AuthService.java             # Authentication logic
│   ├── StudentService.java          # Student business logic
│   └── AttendanceService.java       # Attendance business logic
├── dto/
│   ├── LoginRequest.java            # Login request DTO
│   ├── LoginResponse.java           # Login response DTO
│   ├── StudentDTO.java              # Student DTO
│   └── AttendanceDTO.java           # Attendance DTO
└── security/
    ├── JwtUtil.java                 # JWT utility class
    ├── JwtAuthenticationFilter.java # JWT filter
    └── UserDetailsServiceImpl.java  # User details service
```

## Testing with Postman/Curl

### 1. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. Get Students (with token)
```bash
curl -X GET http://localhost:8080/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Create Student
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "department": "Computer Science",
    "year": "2nd Year",
    "section": "B"
  }'
```

## Production Deployment

### Environment Variables
Set these environment variables in production:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/attendance_db
export SPRING_DATASOURCE_USERNAME=your_username
export SPRING_DATASOURCE_PASSWORD=your_password
export JWT_SECRET=your-very-long-and-secure-secret-key
export CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Build for Production
```bash
mvn clean package -DskipTests
```

### Run Production JAR
```bash
java -jar target/attendance-backend-1.0.0.jar \
  --spring.profiles.active=prod \
  --server.port=8080
```

## Security Considerations

1. **Change default passwords** before deploying to production
2. **Use HTTPS** in production environments
3. **Update JWT secret** to a strong, random string
4. **Configure CORS** to allow only your frontend domain
5. **Enable rate limiting** for API endpoints
6. **Use environment variables** for sensitive configuration
7. **Implement proper logging** and monitoring
8. **Regular security audits** and dependency updates

## Troubleshooting

### Database Connection Issues
- Verify database is running
- Check credentials in application.properties
- Ensure database exists

### JWT Token Issues
- Verify token is included in Authorization header
- Check token expiration (24 hours by default)
- Ensure JWT secret matches between requests

### CORS Issues
- Update `cors.allowed-origins` in application.properties
- Restart the application after changes

## License

This project is for educational purposes.
