import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar, BookOpen, Users, CheckCircle, XCircle } from 'lucide-react';

export default function AttendancePage() {
  const { students, markAttendance } = useApp();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: 'present' | 'absent' }>({});
  const [showStudentList, setShowStudentList] = useState(false);

  const classes = ['1st Year CS-A', '1st Year CS-B', '2nd Year CS-A', '3rd Year CS-A', '4th Year CS-A'];
  const subjects = ['Data Structures', 'Algorithms', 'Database Management', 'Operating Systems', 'Computer Networks'];

  const handleProceed = () => {
    if (selectedClass && selectedSubject && selectedDate) {
      setShowStudentList(true);
      // Initialize all students as absent by default
      const initialAttendance: { [key: string]: 'present' | 'absent' } = {};
      students.forEach(student => {
        initialAttendance[student.id] = 'absent';
      });
      setAttendanceData(initialAttendance);
    }
  };

  const handleToggleAttendance = (studentId: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const handleSubmit = () => {
    const records = Object.entries(attendanceData).map(([studentId, status]) => {
      const student = students.find(s => s.id === studentId);
      return {
        studentId,
        studentName: student?.name || '',
        subject: selectedSubject,
        class: selectedClass,
        date: selectedDate,
        status,
      };
    });
    markAttendance(records);
    alert('Attendance marked successfully!');
    navigate('/dashboard');
  };

  const presentCount = Object.values(attendanceData).filter(status => status === 'present').length;
  const absentCount = Object.values(attendanceData).filter(status => status === 'absent').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
              <p className="text-sm text-gray-600 mt-1">Record student attendance for classes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showStudentList ? (
          /* Selection Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Class Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Class
                    </div>
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="">Select a class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Subject
                    </div>
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                <button
                  onClick={handleProceed}
                  disabled={!selectedClass || !selectedSubject || !selectedDate}
                  className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  Proceed to Mark Attendance
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Student List */
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Class</p>
                    <p className="text-xl font-semibold text-gray-900">{selectedClass}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Subject</p>
                    <p className="text-xl font-semibold text-gray-900">{selectedSubject}</p>
                  </div>
                  <BookOpen className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="text-xl font-semibold text-gray-900">{selectedDate}</p>
                  </div>
                  <Calendar className="w-10 h-10 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Attendance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Present</p>
                    <p className="text-2xl font-bold text-green-900">{presentCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-red-700">Absent</p>
                    <p className="text-2xl font-bold text-red-900">{absentCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Student List</h2>
                <p className="text-sm text-gray-600 mt-1">Click on a student to toggle attendance</p>
              </div>
              <div className="divide-y divide-gray-100">
                {students.map(student => (
                  <div
                    key={student.id}
                    onClick={() => handleToggleAttendance(student.id)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          attendanceData[student.id] === 'present' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {attendanceData[student.id] === 'present' ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            {student.department} - {student.year} - Section {student.section}
                          </p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        attendanceData[student.id] === 'present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attendanceData[student.id] === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowStudentList(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Submit Attendance
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
