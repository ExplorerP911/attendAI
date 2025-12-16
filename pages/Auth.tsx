import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Camera, ChevronLeft, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  role: UserRole;
  mode: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ role, mode }) => {
  const { login, register, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState(role === UserRole.TEACHER ? '' : '');
  const [password, setPassword] = useState('');
  
  // Registration specific fields
  const [name, setName] = useState('');
  const [usn, setUsn] = useState(''); // Student
  const [course, setCourse] = useState(''); // Student
  const [institution, setInstitution] = useState(''); // Teacher

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
        if (mode === 'login') {
            // Identifier is Email for Supabase (usually)
            await login(identifier, role, password);
        } else {
            await register(identifier, password, {
                role,
                name,
                email: identifier,
                ...(role === UserRole.STUDENT ? { usn, course } : { institution })
            });
            // Auto login or redirect happens via AuthContext
        }
        // Redirect logic handled by App.tsx observing user state
    } catch (err: any) {
        setError(err.message || "Authentication failed. Please check your credentials.");
    }
  };

  const navigate = (path: string) => {
    window.location.hash = path;
    setError(null);
  };

  const isTeacher = role === UserRole.TEACHER;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left Panel - Hero */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white p-12 flex-col justify-between">
        <div>
             <div className="flex items-center space-x-2 mb-8">
                <div className="bg-white/20 p-2 rounded-lg">
                    <Camera className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Attend</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
                {isTeacher ? "Manage your classroom effectively." : "Track your attendance effortlessly."}
            </h1>
            <p className="text-blue-100 text-lg">
                {isTeacher 
                    ? "Join thousands of educators saving time with AI-powered attendance."
                    : "Keep track of your academic progress with real-time updates."
                }
            </p>
        </div>
        <div className="text-sm text-blue-200">
            &copy; 2024 Attend Inc.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 md:p-24 bg-white overflow-y-auto">
        <button onClick={() => navigate('')} className="flex items-center text-slate-500 hover:text-slate-800 mb-8 self-start">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
        </button>

        <div className="max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {mode === 'login' ? `Welcome back, ${isTeacher ? 'Teacher' : 'Student'}!` : `Create ${isTeacher ? 'Teacher' : 'Student'} Account`}
            </h2>
            <p className="text-slate-500 mb-8">
                {mode === 'login' ? 'Please sign in to continue.' : 'Get started in seconds.'}
            </p>

            {error && (
                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-start space-x-2 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                {mode === 'register' && !isTeacher && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">USN</label>
                            <input 
                                type="text" 
                                value={usn}
                                onChange={(e) => setUsn(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="USN123..."
                                required
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                            <input 
                                type="text" 
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Computer Science"
                                required
                            />
                        </div>
                    </>
                )}

                 {mode === 'register' && isTeacher && (
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                        <input 
                            type="text" 
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="University Name"
                            required
                        />
                    </div>
                 )}
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Password
                    </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                   {isLoading ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                       mode === 'login' ? 'Sign In' : 'Create Account'
                   )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
                {mode === 'login' ? (
                    <>
                        Don't have an account?{' '}
                        <button onClick={() => navigate(`register/${role === UserRole.TEACHER ? 'teacher' : 'student'}`)} className="text-blue-600 font-medium hover:underline">
                            Sign up
                        </button>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <button onClick={() => navigate(`login/${role === UserRole.TEACHER ? 'teacher' : 'student'}`)} className="text-blue-600 font-medium hover:underline">
                            Sign in
                        </button>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};