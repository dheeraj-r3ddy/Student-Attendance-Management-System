import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Search, Download, Calendar, Filter } from 'lucide-react';

export default function ReportsPage() {
  const { students, attendanceRecords } = useApp();
  const navigate = useNavigate();
  const [filterStudent, setFilterStudent] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get unique values for filters
  const uniqueSubjects = Array.from(new Set(attendanceRecords.map(r => r.subject)));
  const uniqueClasses = Array.from(new Set(attendanceRecords.map(r => r.class)));

  // Filter records
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      const matchesStudent = !filterStudent || record.studentName.toLowerCase().includes(filterStudent.toLowerCase());
      const matchesSubject = !filterSubject || record.subject === filterSubject;
      const matchesClass = !filterClass || record.class === filterClass;
      const matchesStartDate = !startDate || record.date >= startDate;
      const matchesEndDate = !endDate || record.date <= endDate;
      
      return matchesStudent && matchesSubject && matchesClass && matchesStartDate && matchesEndDate;
    });
  }, [attendanceRecords, filterStudent, filterSubject, filterClass, startDate, endDate]);

  // Calculate student-wise attendance
  const studentStats = useMemo(() => {
    const stats: { [key: string]: { name: string; total: number; present: number; percentage: number } } = {};
    
    students.forEach(student => {
      const studentRecords = filteredRecords.filter(r => r.studentId === student.id);
      const total = studentRecords.length;
      const present = studentRecords.filter(r => r.status === 'present').length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      stats[student.id] = {
        name: student.name,
        total,
        present,
        percentage,
      };
    });
    
    return Object.entries(stats).filter(([_, stat]) => stat.total > 0);
  }, [students, filteredRecords]);

  const handleExportReport = () => {
    alert('Report export functionality would be implemented here. This would generate a CSV or PDF file.');
  };

  const totalRecords = filteredRecords.length;
  const totalPresent = filteredRecords.filter(r => r.status === 'present').length;
  const overallPercentage = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
                <p className="text-sm text-gray-600 mt-1">View and analyze attendance data</p>
              </div>
            </div>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filterStudent}
                  onChange={(e) => setFilterStudent(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">All Classes</option>
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Records</p>
            <p className="text-3xl font-bold text-gray-900">{totalRecords}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Present</p>
            <p className="text-3xl font-bold text-green-600">{totalPresent}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Overall Attendance</p>
            <p className="text-3xl font-bold text-indigo-600">{overallPercentage}%</p>
          </div>
        </div>

        {/* Student-wise Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Student-wise Attendance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Student Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total Classes</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Present</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Absent</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Attendance %</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {studentStats.map(([id, stat]) => (
                  <tr key={id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{stat.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{stat.total}</td>
                    <td className="py-4 px-6 text-sm text-green-700">{stat.present}</td>
                    <td className="py-4 px-6 text-sm text-red-700">{stat.total - stat.present}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{stat.percentage}%</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        stat.percentage >= 75
                          ? 'bg-green-100 text-green-800'
                          : stat.percentage >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {stat.percentage >= 75 ? 'Good' : stat.percentage >= 60 ? 'Average' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
                {studentStats.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No attendance data found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Records */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Detailed Attendance Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Student Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Subject</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Class</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">{record.studentName}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{record.subject}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{record.class}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{record.date}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      No records found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
