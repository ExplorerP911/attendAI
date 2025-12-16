import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Home, Users, Calendar, User as UserIcon, LogOut, Menu, X, Camera } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = (path: string) => {
    window.location.hash = path;
    setIsMobileMenuOpen(false);
  };

  if (!user) return <>{children}</>;

  const isTeacher = user.role === UserRole.TEACHER;

  const NavItem = ({ icon: Icon, label, path }: { icon: any, label: string, path: string }) => (
    <button
      onClick={() => navigate(path)}
      className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 w-full rounded-lg transition-colors"
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <Camera className="w-5 h-5 text-white" />
            </div>
          <span className="text-xl font-bold text-slate-900">Attend</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {isTeacher ? (
            <>
              <NavItem icon={Home} label="Dashboard" path="teacher/dashboard" />
              <NavItem icon={Camera} label="Take Attendance" path="teacher/take-attendance" />
              <NavItem icon={Users} label="Students" path="teacher/students" />
              <NavItem icon={Calendar} label="History" path="teacher/history" />
            </>
          ) : (
            <>
              <NavItem icon={Home} label="Dashboard" path="student/dashboard" />
              <NavItem icon={Calendar} label="Attendance" path="student/attendance" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
            <button 
                onClick={() => navigate(isTeacher ? 'teacher/profile' : 'student/profile')}
                className="flex items-center space-x-3 px-4 py-3 w-full hover:bg-slate-50 rounded-lg mb-2"
            >
                <img src={user.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{isTeacher ? 'Teacher' : 'Student'}</p>
                </div>
            </button>
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2">
           <div className="bg-blue-600 p-1.5 rounded-lg">
                <Camera className="w-4 h-4 text-white" />
            </div>
          <span className="font-bold text-lg text-slate-900">Attend</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-10 pt-20 px-6 space-y-4">
             {isTeacher ? (
            <>
              <NavItem icon={Home} label="Dashboard" path="teacher/dashboard" />
              <NavItem icon={Camera} label="Take Attendance" path="teacher/take-attendance" />
              <NavItem icon={Users} label="Students" path="teacher/students" />
              <NavItem icon={Calendar} label="History" path="teacher/history" />
              <NavItem icon={UserIcon} label="Profile" path="teacher/profile" />
            </>
          ) : (
            <>
              <NavItem icon={Home} label="Dashboard" path="student/dashboard" />
              <NavItem icon={Calendar} label="Attendance" path="student/attendance" />
              <NavItem icon={UserIcon} label="Profile" path="student/profile" />
            </>
          )}
          <div className="border-t border-slate-100 pt-4 mt-4">
             <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-20 pb-safe">
        <button onClick={() => navigate(isTeacher ? 'teacher/dashboard' : 'student/dashboard')} className="flex flex-col items-center text-slate-600 hover:text-blue-600">
            <Home className="w-6 h-6" />
            <span className="text-[10px] mt-1">Home</span>
        </button>
        {isTeacher && (
             <button onClick={() => navigate('teacher/take-attendance')} className="flex flex-col items-center text-blue-600">
                <div className="bg-blue-100 p-2 rounded-full -mt-6 border-4 border-slate-50 shadow-lg">
                    <Camera className="w-6 h-6" />
                </div>
                <span className="text-[10px] mt-1 font-medium">Capture</span>
            </button>
        )}
        <button onClick={() => navigate(isTeacher ? 'teacher/students' : 'student/attendance')} className="flex flex-col items-center text-slate-600 hover:text-blue-600">
            <Calendar className="w-6 h-6" />
             <span className="text-[10px] mt-1">{isTeacher ? 'Students' : 'History'}</span>
        </button>
      </div>
    </div>
  );
};