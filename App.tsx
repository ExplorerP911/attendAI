import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/Landing.tsx';
import { AuthPage } from './pages/Auth.tsx';
import { TeacherDashboard } from './pages/teacher/Dashboard.tsx';
import { TakeAttendance } from './pages/teacher/TakeAttendance.tsx';
import { StudentList } from './pages/teacher/Students.tsx';
import { StudentDashboard } from './pages/student/Dashboard.tsx';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentHash, setCurrentHash] = useState(window.location.hash.replace('#', '') || '');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace('#', ''));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Public Routes
  if (!user) {
    if (currentHash === 'login/teacher') return <AuthPage role={UserRole.TEACHER} mode="login" />;
    if (currentHash === 'login/student') return <AuthPage role={UserRole.STUDENT} mode="login" />;
    if (currentHash === 'register/teacher') return <AuthPage role={UserRole.TEACHER} mode="register" />;
    if (currentHash === 'register/student') return <AuthPage role={UserRole.STUDENT} mode="register" />;
    return <LandingPage />;
  }

  // Private Routes wrapped in Layout
  const renderPage = () => {
    if (user.role === UserRole.TEACHER) {
      switch (currentHash) {
        case 'teacher/take-attendance': return <TakeAttendance />;
        case 'teacher/students': return <StudentList />;
        case 'teacher/history': return <div className="text-center p-10 text-slate-500">History Module (Coming Soon)</div>;
        case 'teacher/profile': return <div className="text-center p-10 text-slate-500">Teacher Profile (Coming Soon)</div>;
        default: return <TeacherDashboard />;
      }
    } else {
      switch (currentHash) {
        case 'student/attendance': return <div className="text-center p-10 text-slate-500">Detailed Attendance View (Coming Soon)</div>;
        case 'student/profile': return <div className="text-center p-10 text-slate-500">Student Profile (Coming Soon)</div>;
        default: return <StudentDashboard />;
      }
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;