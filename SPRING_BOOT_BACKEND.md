# Spring Boot Backend - Student Attendance Management System

## Project Structure
```
attendance-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── attendance/
│   │   │           ├── AttendanceApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   └── CorsConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── StudentController.java
│   │   │           │   └── AttendanceController.java
│   │   │           ├── model/
│   │   │           │   ├── User.java
│   │   │           │   ├── Student.java
│   │   │           │   └── AttendanceRecord.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── StudentRepository.java
│   │   │           │   └── AttendanceRepository.java
│   │   │           ├── service/
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── StudentService.java
│   │   │           │   └── AttendanceService.java
│   │   │           ├── dto/
│   │   │           │   ├── LoginRequest.java
│   │   │           │   ├── LoginResponse.java
│   │   │           │   ├── StudentDTO.java
│   │   │           │   └── AttendanceDTO.java
│   │   │           └── security/
│   │   │               ├── JwtUtil.java
│   │   │               ├── JwtAuthenticationFilter.java
│   │   │               └── UserDetailsServiceImpl.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── schema.sql
│   └── test/
├── pom.xml
└── README.md
```

## Complete Backend Implementation Files Below
