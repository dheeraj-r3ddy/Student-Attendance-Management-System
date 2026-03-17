import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  department: string;
  year: string;
  section: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  class: string;
  date: string;
  status: 'present' | 'absent';
}

interface User {
  username: string;
  role: 'admin' | 'faculty';
}

interface AppContextType {
  user: User | null;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Omit<Student, 'id'>) => void;
  deleteStudent: (id: string) => void;
  markAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock initial data
const initialStudents: Student[] = [
  { id: '1', name: 'John Smith', department: 'Computer Science', year: '3rd Year', section: 'A' },
  { id: '2', name: 'Emma Wilson', department: 'Computer Science', year: '3rd Year', section: 'A' },
  { id: '3', name: 'Michael Brown', department: 'Computer Science', year: '3rd Year', section: 'A' },
  { id: '4', name: 'Sarah Davis', department: 'Electronics', year: '2nd Year', section: 'B' },
  { id: '5', name: 'James Johnson', department: 'Mechanical', year: '4th Year', section: 'A' },
];

const initialAttendance: AttendanceRecord[] = [
  { id: '1', studentId: '1', studentName: 'John Smith', subject: 'Data Structures', class: '3rd Year CS-A', date: '2026-03-01', status: 'present' },
  { id: '2', studentId: '2', studentName: 'Emma Wilson', subject: 'Data Structures', class: '3rd Year CS-A', date: '2026-03-01', status: 'present' },
  { id: '3', studentId: '1', studentName: 'John Smith', subject: 'Algorithms', class: '3rd Year CS-A', date: '2026-03-05', status: 'absent' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendance);

  const login = (username: string, password: string): boolean => {
    // Mock authentication - in real app, this would verify against a database
    if (username && password) {
      setUser({ username, role: username === 'admin' ? 'admin' : 'faculty' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
    };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id: string, student: Omit<Student, 'id'>) => {
    setStudents(students.map(s => s.id === id ? { ...student, id } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setAttendanceRecords(attendanceRecords.filter(r => r.studentId !== id));
  };

  const markAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords = records.map(record => ({
      ...record,
      id: `${Date.now()}-${Math.random()}`,
    }));
    setAttendanceRecords([...attendanceRecords, ...newRecords]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        students,
        attendanceRecords,
        login,
        logout,
        addStudent,
        updateStudent,
        deleteStudent,
        markAttendance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
