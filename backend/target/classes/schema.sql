-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'FACULTY')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    year VARCHAR(50) NOT NULL,
    section VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    class VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject, class, date),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_subject ON attendance_records(subject);
CREATE INDEX IF NOT EXISTS idx_attendance_class ON attendance_records(class);

-- Insert default admin user (password: admin123)
-- Password is BCrypt hash of 'admin123'
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2a$10$X5wFWMY6PmKvGqXZJq3w9.Pqv6Z7YvYm8u5K3mZQJ1cXxJ5xK9Lwm', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- Insert default faculty user (password: faculty123)
INSERT INTO users (username, password, role) 
VALUES ('faculty', '$2a$10$Y6xGXNZ7QnLwHrYaKq4x0.Rqw7a8ZwZn9v6L4naRK2dYyK6yL0Mxn', 'FACULTY')
ON CONFLICT (username) DO NOTHING;

-- Insert sample students
INSERT INTO students (name, department, year, section) VALUES
('John Smith', 'Computer Science', '3rd Year', 'A'),
('Emma Wilson', 'Computer Science', '3rd Year', 'A'),
('Michael Brown', 'Computer Science', '3rd Year', 'A'),
('Sarah Davis', 'Electronics', '2nd Year', 'B'),
('James Johnson', 'Mechanical', '4th Year', 'A')
ON CONFLICT DO NOTHING;
