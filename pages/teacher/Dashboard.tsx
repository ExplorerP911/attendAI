import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, UserCheck, Clock, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MockDataService } from '../../services/mockStore';
import { AttendanceSession } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        if(user) {
            const data = await MockDataService.getSessions(user.id);
            setSessions(data);
            setLoading(false);
        }
    };
    loadData();
  }, [user]);

  // Calculate stats
  const totalStudents = sessions.reduce((acc, curr) => acc + curr.totalStudents, 0); // Simplified logic
  const avgAttendance = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, curr) => acc + (curr.presentCount / curr.totalStudents), 0) / sessions.length * 100)
    : 0;
  
  const todayClasses = sessions.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).length;

  const stats = [
    { label: 'Total Sessions', value: sessions.length.toString(), icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Avg. Attendance', value: `${avgAttendance}%`, icon: UserCheck, color: 'bg-green-100 text-green-600' },
    { label: 'Classes Today', value: todayClasses.toString(), icon: Clock, color: 'bg-orange-100 text-orange-600' },
  ];

  // Map last 5 sessions for chart
  const chartData = sessions.slice(0, 5).reverse().map(s => ({
      name: new Date(s.date).toLocaleDateString('en-US', {weekday: 'short'}),
      present: s.presentCount,
      absent: s.absentCount
  }));

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user?.name}</p>
        </div>
        <button 
            onClick={() => navigate('teacher/take-attendance')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-lg shadow-blue-600/20"
        >
            Take Attendance <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{loading ? '...' : stat.value}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Attendance</h3>
            <div className="h-64">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <YAxis hide />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="present" name="Present" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
                )}
            </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Sessions</h3>
            <div className="space-y-4">
                {sessions.slice(0, 3).map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{s.className || 'Class Session'}</p>
                                <p className="text-xs text-slate-500">{new Date(s.date).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-green-600">{s.presentCount}/{s.totalStudents}</p>
                            <p className="text-xs text-slate-400">Present</p>
                        </div>
                    </div>
                ))}
                {sessions.length === 0 && <p className="text-center text-slate-500 py-4">No sessions recorded yet.</p>}
            </div>
             <button className="w-full mt-4 text-center text-sm text-blue-600 font-medium hover:underline">View All History</button>
        </div>
      </div>
    </div>
  );
};