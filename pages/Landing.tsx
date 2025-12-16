import React from 'react';
import { Camera, ShieldCheck, Zap, Users } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Attend</span>
        </div>
        <div className="space-x-4">
            <button onClick={() => navigate('login/teacher')} className="text-slate-600 hover:text-blue-600 font-medium">Teacher Login</button>
            <button onClick={() => navigate('login/student')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Student Login</button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-16 md:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Smart Attendance for <br/> <span className="text-blue-600">Modern Classrooms</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl">
            Say goodbye to manual roll calls. Capture a classroom photo and let AI identify your students instantly. Fast, accurate, and effortless.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
                onClick={() => navigate('login/teacher')}
                className="flex items-center justify-center space-x-2 bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
            >
                <Users className="w-5 h-5" />
                <span>I'm a Teacher</span>
            </button>
            <button 
                onClick={() => navigate('login/student')}
                className="flex items-center justify-center space-x-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
            >
                <ShieldCheck className="w-5 h-5" />
                <span>I'm a Student</span>
            </button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                    <Camera />
                </div>
                <h3 className="text-xl font-bold mb-2">Snap & Done</h3>
                <p className="text-slate-600">Just take a picture of the class. Our AI processes the image in seconds to mark attendance.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                    <Zap />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-time Stats</h3>
                <p className="text-slate-600">Live dashboards for teachers and students to track attendance rates and trends.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                    <ShieldCheck />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                <p className="text-slate-600">Enterprise-grade security keeps student data and biometric information safe.</p>
            </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>&copy; 2024 Attend App. All rights reserved.</p>
      </footer>
    </div>
  );
};