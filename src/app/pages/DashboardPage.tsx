import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Users, ClipboardCheck, BarChart3, LogOut, UserCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, students, attendanceRecords, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate statistics
  const totalStudents = students.length;
  const totalClasses = new Set(attendanceRecords.map(r => r.class)).size;
  const totalAttendanceRecords = attendanceRecords.length;
  const attendancePercentage = attendanceRecords.length > 0
    ? Math.round((attendanceRecords.filter(r => r.status === 'present').length / attendanceRecords.length) * 100)
    : 0;

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Classes',
      value: totalClasses,
      icon: ClipboardCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Attendance Records',
      value: totalAttendanceRecords,
      icon: BarChart3,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Attendance Rate',
      value: `${attendancePercentage}%`,
      icon: BarChart3,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const navigationCards = [
    {
      title: 'Manage Students',
      description: 'Add, edit, or delete student records',
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      path: '/students',
    },
    {
      title: 'Mark Attendance',
      description: 'Record student attendance for classes',
      icon: ClipboardCheck,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      path: '/attendance',
    },
    {
      title: 'Attendance Reports',
      description: 'View and analyze attendance data',
      icon: BarChart3,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      path: '/reports',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Student Attendance Management System</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <UserCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-8 h-8 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {navigationCards.map((card) => (
            <button
              key={card.title}
              onClick={() => navigate(card.path)}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all text-left"
            >
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Attendance Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Class</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.slice(-5).reverse().map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{record.studentName}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{record.subject}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{record.class}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{record.date}</td>
                    <td className="py-3 px-4">
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
                {attendanceRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No attendance records yet
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
