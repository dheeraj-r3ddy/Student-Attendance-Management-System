# Backend Implementation Guide for Student Attendance Management System

## Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'faculty')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Students Table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  year VARCHAR(50) NOT NULL,
  section VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Attendance Records Table
```sql
CREATE TABLE attendance_records (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  class VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, subject, class, date)
);
```

## API Endpoints Specification

### Authentication Endpoints

#### POST /api/auth/login
**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### POST /api/auth/logout
**Headers:** Authorization: Bearer {token}

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Student Management Endpoints

#### GET /api/students
**Headers:** Authorization: Bearer {token}

**Query Parameters:**
- search (optional): Filter by name, department, or section

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "id": "1",
      "name": "John Smith",
      "department": "Computer Science",
      "year": "3rd Year",
      "section": "A"
    }
  ]
}
```

#### POST /api/students
**Headers:** Authorization: Bearer {token}

**Request Body:**
```json
{
  "name": "John Smith",
  "department": "Computer Science",
  "year": "3rd Year",
  "section": "A"
}
```

**Response:**
```json
{
  "success": true,
  "student": {
    "id": "1",
    "name": "John Smith",
    "department": "Computer Science",
    "year": "3rd Year",
    "section": "A"
  }
}
```

#### PUT /api/students/:id
**Headers:** Authorization: Bearer {token}

**Request Body:**
```json
{
  "name": "John Smith Updated",
  "department": "Computer Science",
  "year": "4th Year",
  "section": "A"
}
```

**Response:**
```json
{
  "success": true,
  "student": {
    "id": "1",
    "name": "John Smith Updated",
    "department": "Computer Science",
    "year": "4th Year",
    "section": "A"
  }
}
```

#### DELETE /api/students/:id
**Headers:** Authorization: Bearer {token}

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

### Attendance Endpoints

#### POST /api/attendance
**Headers:** Authorization: Bearer {token}

**Request Body:**
```json
{
  "records": [
    {
      "studentId": "1",
      "studentName": "John Smith",
      "subject": "Data Structures",
      "class": "3rd Year CS-A",
      "date": "2026-03-17",
      "status": "present"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "recordsCreated": 1
}
```

#### GET /api/attendance/records
**Headers:** Authorization: Bearer {token}

**Query Parameters:**
- studentName (optional)
- subject (optional)
- class (optional)
- startDate (optional)
- endDate (optional)

**Response:**
```json
{
  "success": true,
  "records": [
    {
      "id": "1",
      "studentId": "1",
      "studentName": "John Smith",
      "subject": "Data Structures",
      "class": "3rd Year CS-A",
      "date": "2026-03-17",
      "status": "present"
    }
  ],
  "statistics": {
    "totalRecords": 100,
    "totalPresent": 85,
    "overallPercentage": 85
  }
}
```

#### GET /api/attendance/reports/student-wise
**Headers:** Authorization: Bearer {token}

**Query Parameters:**
- studentName (optional)
- subject (optional)
- class (optional)
- startDate (optional)
- endDate (optional)

**Response:**
```json
{
  "success": true,
  "studentStats": [
    {
      "studentId": "1",
      "name": "John Smith",
      "total": 20,
      "present": 18,
      "percentage": 90
    }
  ]
}
```

## Node.js/Express Backend Example

### Server Setup (server.js)
```javascript
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'attendance_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', authenticateToken, require('./routes/students'));
app.use('/api/attendance', authenticateToken, require('./routes/attendance'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Authentication Routes (routes/auth.js)
```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
```

### Student Routes (routes/students.js)
```javascript
const express = require('express');
const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  const { search } = req.query;

  try {
    let query = 'SELECT * FROM students';
    const params = [];

    if (search) {
      query += ' WHERE name ILIKE $1 OR department ILIKE $1 OR section ILIKE $1';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY name';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      students: result.rows.map(row => ({
        id: row.id.toString(),
        name: row.name,
        department: row.department,
        year: row.year,
        section: row.section,
      })),
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add student
router.post('/', async (req, res) => {
  const { name, department, year, section } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO students (name, department, year, section) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, department, year, section]
    );

    const student = result.rows[0];

    res.json({
      success: true,
      student: {
        id: student.id.toString(),
        name: student.name,
        department: student.department,
        year: student.year,
        section: student.section,
      },
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, department, year, section } = req.body;

  try {
    const result = await pool.query(
      'UPDATE students SET name = $1, department = $2, year = $3, section = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, department, year, section, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = result.rows[0];

    res.json({
      success: true,
      student: {
        id: student.id.toString(),
        name: student.name,
        department: student.department,
        year: student.year,
        section: student.section,
      },
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
```

### Attendance Routes (routes/attendance.js)
```javascript
const express = require('express');
const router = express.Router();

// Mark attendance
router.post('/', async (req, res) => {
  const { records } = req.body;

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const record of records) {
        await client.query(
          `INSERT INTO attendance_records (student_id, student_name, subject, class, date, status)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (student_id, subject, class, date)
           DO UPDATE SET status = $6`,
          [
            record.studentId,
            record.studentName,
            record.subject,
            record.class,
            record.date,
            record.status,
          ]
        );
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Attendance marked successfully',
        recordsCreated: records.length,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get attendance records
router.get('/records', async (req, res) => {
  const { studentName, subject, class: className, startDate, endDate } = req.query;

  try {
    let query = 'SELECT * FROM attendance_records WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (studentName) {
      paramCount++;
      query += ` AND student_name ILIKE $${paramCount}`;
      params.push(`%${studentName}%`);
    }

    if (subject) {
      paramCount++;
      query += ` AND subject = $${paramCount}`;
      params.push(subject);
    }

    if (className) {
      paramCount++;
      query += ` AND class = $${paramCount}`;
      params.push(className);
    }

    if (startDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ' ORDER BY date DESC, student_name';

    const result = await pool.query(query, params);

    const records = result.rows.map(row => ({
      id: row.id.toString(),
      studentId: row.student_id.toString(),
      studentName: row.student_name,
      subject: row.subject,
      class: row.class,
      date: row.date.toISOString().split('T')[0],
      status: row.status,
    }));

    const totalRecords = records.length;
    const totalPresent = records.filter(r => r.status === 'present').length;
    const overallPercentage = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

    res.json({
      success: true,
      records,
      statistics: {
        totalRecords,
        totalPresent,
        overallPercentage,
      },
    });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get student-wise attendance report
router.get('/reports/student-wise', async (req, res) => {
  const { studentName, subject, class: className, startDate, endDate } = req.query;

  try {
    let query = `
      SELECT 
        student_id,
        student_name,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present
      FROM attendance_records
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (studentName) {
      paramCount++;
      query += ` AND student_name ILIKE $${paramCount}`;
      params.push(`%${studentName}%`);
    }

    if (subject) {
      paramCount++;
      query += ` AND subject = $${paramCount}`;
      params.push(subject);
    }

    if (className) {
      paramCount++;
      query += ` AND class = $${paramCount}`;
      params.push(className);
    }

    if (startDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ' GROUP BY student_id, student_name ORDER BY student_name';

    const result = await pool.query(query, params);

    const studentStats = result.rows.map(row => ({
      studentId: row.student_id.toString(),
      name: row.student_name,
      total: parseInt(row.total),
      present: parseInt(row.present),
      percentage: Math.round((parseInt(row.present) / parseInt(row.total)) * 100),
    }));

    res.json({
      success: true,
      studentStats,
    });
  } catch (error) {
    console.error('Error generating student-wise report:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
```

## Environment Variables (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
```

## Package.json for Backend
```json
{
  "name": "attendance-backend",
  "version": "1.0.0",
  "description": "Backend for Student Attendance Management System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Setup Instructions

1. **Install PostgreSQL** on your server
2. **Create database**: `createdb attendance_db`
3. **Run SQL schema** to create tables
4. **Install backend dependencies**: `npm install`
5. **Create .env file** with your database credentials
6. **Start backend**: `npm start`
7. **Update frontend** to call your API endpoints

## Frontend Integration

You'll need to update the frontend to call these API endpoints instead of using local state. The current implementation uses Context API with mock data, but you can replace it with API calls.

## Security Considerations

- Use HTTPS in production
- Hash passwords with bcrypt (salt rounds >= 10)
- Use strong JWT secrets
- Implement rate limiting
- Add input validation
- Use prepared statements (already done with pg library)
- Implement CORS properly
- Add request size limits
- Use environment variables for sensitive data
