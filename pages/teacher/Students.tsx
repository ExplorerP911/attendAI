import React, { useEffect, useState } from 'react';
import { MockDataService } from '../../services/mockStore';
import { Student } from '../../types';
import { Search, MoreVertical, Plus } from 'lucide-react';

export const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetch = async () => {
      // This now calls SupabaseDataService.getStudents() via the mock wrapper
      const data = await MockDataService.getStudents();
      setStudents(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.usn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Students</h1>
            <p className="text-slate-500">Manage enrolled students and view profiles.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Add Student
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search by name or USN..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {loading ? (
             <div className="p-8 text-center text-slate-500">Loading students...</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Student</th>
                            <th className="px-6 py-3">USN</th>
                            <th className="px-6 py-3">Course</th>
                            <th className="px-6 py-3">Attendance Rate</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length > 0 ? filtered.map(student => (
                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <img src={student.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                                        <div className="font-medium text-slate-900">{student.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{student.usn}</td>
                                <td className="px-6 py-4 text-slate-600">{student.course}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-full bg-slate-200 rounded-full h-1.5 w-16">
                                            <div 
                                                className={`h-1.5 rounded-full ${student.attendanceRate >= 80 ? 'bg-green-500' : student.attendanceRate >= 60 ? 'bg-orange-500' : 'bg-red-500'}`} 
                                                style={{width: `${student.attendanceRate}%`}}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-700">{student.attendanceRate}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-blue-600">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No students found. Add students or ask them to register.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};