import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

const PORT = 8080;
const JWT_SECRET = 'yourSuperSecretKeyForJWTTokenGenerationChangeThisInProduction123456789';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://40.0.24.221:5174'],
  credentials: true
}));
app.use(express.json());

// Mock database
let students = [
  { id: 1, name: 'John Doe', department: 'CSE', year: '3rd', section: 'A', created_at: new Date(), updated_at: new Date() },
  { id: 2, name: 'Jane Smith', department: 'CSE', year: '3rd', section: 'A', created_at: new Date(), updated_at: new Date() },
  { id: 3, name: 'Bob Johnson', department: 'ECE', year: '2nd', section: 'B', created_at: new Date(), updated_at: new Date() }
];

let attendanceRecords = [
  { id: 1, student_id: 1, student_name: 'John Doe', subject: 'Database', class: 'CSE-3A', date: '2026-03-17', status: 'present', created_at: new Date() },
  { id: 2, student_id: 2, student_name: 'Jane Smith', subject: 'Database', class: 'CSE-3A', date: '2026-03-17', status: 'present', created_at: new Date() },
  { id: 3, student_id: 3, student_name: 'Bob Johnson', subject: 'Database', class: 'ECE-2B', date: '2026-03-17', status: 'absent', created_at: new Date() }
];

let users = [
  { id: 1, username: 'admin', password_hash: 'hashed_password', role: 'admin', created_at: new Date() },
  { id: 2, username: 'faculty', password_hash: 'hashed_password', role: 'faculty', created_at: new Date() }
];

// Authentication Endpoints
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Mock authentication
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Student Endpoints
app.get('/api/students', (req, res) => {
  try {
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/students/:id', (req, res) => {
  try {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students', (req, res) => {
  try {
    const { name, department, year, section } = req.body;
    const newStudent = {
      id: Math.max(...students.map(s => s.id), 0) + 1,
      name,
      department,
      year,
      section,
      created_at: new Date(),
      updated_at: new Date()
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/students/:id', (req, res) => {
  try {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    Object.assign(student, req.body, { updated_at: new Date() });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/students/:id', (req, res) => {
  try {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const deleted = students.splice(index, 1);
    res.json(deleted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Attendance Endpoints
app.get('/api/attendance', (req, res) => {
  try {
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance/student/:studentId', (req, res) => {
  try {
    const records = attendanceRecords.filter(a => a.student_id === parseInt(req.params.studentId));
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance', (req, res) => {
  try {
    const { student_id, student_name, subject, class: classVal, date, status } = req.body;
    const newRecord = {
      id: Math.max(...attendanceRecords.map(a => a.id), 0) + 1,
      student_id,
      student_name,
      subject,
      class: classVal,
      date,
      status,
      created_at: new Date()
    };
    attendanceRecords.push(newRecord);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/attendance/:id', (req, res) => {
  try {
    const record = attendanceRecords.find(a => a.id === parseInt(req.params.id));
    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    Object.assign(record, req.body);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/attendance/:id', (req, res) => {
  try {
    const index = attendanceRecords.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    const deleted = attendanceRecords.splice(index, 1);
    res.json(deleted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reports Endpoint
app.get('/api/reports/attendance-summary', (req, res) => {
  try {
    const summary = {};
    attendanceRecords.forEach(record => {
      if (!summary[record.student_name]) {
        summary[record.student_name] = { present: 0, absent: 0 };
      }
      if (record.status === 'present') {
        summary[record.student_name].present++;
      } else {
        summary[record.student_name].absent++;
      }
    });
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend API is running', timestamp: new Date() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✓ Backend API Server running at http://localhost:${PORT}`);
  console.log(`✓ CORS enabled for frontend at http://localhost:5173 and http://localhost:5174\n`);
});
