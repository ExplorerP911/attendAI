import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const attendanceData = [
    { name: 'Present', value: 85, color: '#10B981' },
    { name: 'Absent', value: 15, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
             <img src={user?.avatarUrl} alt="Profile" className="w-16 h-16 rounded-full border-2 border-blue-100" />
             <div>
                 <h1 className="text-2xl font-bold text-slate-900">Hello, {user?.name}</h1>
                 <p className="text-slate-500">{user?.course || 'Student'}</p>
             </div>
        </div>
        <div className="flex space-x-4 text-center">
            <div className="px-4">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Overall</p>
                <p className="text-3xl font-bold text-blue-600">85%</p>
            </div>
            <div className="w-px bg-slate-200 h-10"></div>
            <div className="px-4">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Classes</p>
                <p className="text-3xl font-bold text-slate-900">42</p>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-slate-400" /> Attendance Overview
            </h3>
            <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {attendanceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
             <div className="flex justify-center space-x-6">
                {attendanceData.map((d, i) => (
                    <div key={i} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                        <span className="text-sm font-medium text-slate-600">{d.name} ({d.value}%)</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-slate-400" /> Recent History
            </h3>
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                         <div>
                            <p className="font-medium text-slate-900">Computer Science 101</p>
                            <p className="text-xs text-slate-500">Oct {25 - i}, 2023</p>
                        </div>
                        {i === 2 ? (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">Absent</span>
                        ) : (
                             <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Present</span>
                        )}
                    </div>
                ))}
            </div>
            
             <div className="mt-6 bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-800 text-sm">Low Attendance Alert</h4>
                    <p className="text-xs text-blue-600 mt-1">Your attendance in 'Data Structures' is 72%. Please attend upcoming classes to stay above the 75% threshold.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};