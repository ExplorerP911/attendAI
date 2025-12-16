import { createClient } from '@supabase/supabase-js';
import { User, UserRole, Student, AttendanceSession } from '../types';

// Credentials provided by user
const SUPABASE_URL = 'https://idwruuulucolhxqkfglp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jX7G94hjsSTZSXXuUPHW-A_rvvNR6GZ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const SupabaseAuthService = {
  login: async (email: string, role: UserRole): Promise<User> => {
    // Note: In a real app, we need the password. 
    // This method signature assumes the calling code handles the auth state or passes password separately.
    // However, to fit the existing interface which might mock things, we will try to get the session.
    
    // For this implementation, we will assume the caller actually calls signInWithPassword separately
    // OR we return the current user if already logged in.
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');
    
    // Fetch profile details
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) throw new Error('Profile not found');

    return {
      id: profile.id,
      name: profile.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      role: profile.role as UserRole,
      avatarUrl: profile.avatar_url,
      institution: profile.institution,
      usn: profile.usn,
      course: profile.course
    };
  },

  register: async (email: string, password: string, userData: Partial<User>): Promise<User> => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed');

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: email,
          full_name: userData.name,
          role: userData.role,
          usn: userData.usn,
          course: userData.course,
          institution: userData.institution,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}` // Default avatar
        }
      ]);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Clean up auth user if profile fails? For now just throw.
      throw new Error('Failed to create user profile');
    }

    return {
      id: authData.user.id,
      name: userData.name || '',
      email: email,
      role: userData.role as UserRole,
      ...userData
    } as User;
  },

  logout: async () => {
    await supabase.auth.signOut();
  }
};

export const SupabaseDataService = {
  getStudents: async (): Promise<Student[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', UserRole.STUDENT);

    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }

    return data.map((p: any) => ({
      id: p.id,
      name: p.full_name,
      email: p.email,
      role: UserRole.STUDENT,
      usn: p.usn,
      course: p.course,
      avatarUrl: p.avatar_url,
      attendanceRate: p.attendance_rate || 0 // Assuming a calculated field or default
    }));
  },

  getSessions: async (teacherId?: string): Promise<AttendanceSession[]> => {
    let query = supabase.from('attendance_sessions').select('*').order('date', { ascending: false });
    
    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }

    return data.map((s: any) => ({
      id: s.id,
      date: s.date,
      className: s.class_name,
      totalStudents: s.total_students,
      presentCount: s.present_count,
      absentCount: s.absent_count,
      status: s.status,
      aiAnalysis: {
        description: s.description || '',
        confidenceScore: s.confidence_score || 0,
        studentCount: s.present_count,
        detectedStudents: []
      }
    }));
  },

  saveSession: async (session: AttendanceSession, studentIds: string[]): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Insert Session
    const { data: sessionData, error: sessionError } = await supabase
      .from('attendance_sessions')
      .insert([
        {
          teacher_id: user.id,
          date: new Date().toISOString(),
          class_name: session.className,
          total_students: session.totalStudents,
          present_count: session.presentCount,
          absent_count: session.absentCount,
          status: 'COMPLETED',
          description: session.aiAnalysis?.description,
          confidence_score: session.aiAnalysis?.confidenceScore
        }
      ])
      .select()
      .single();

    if (sessionError) throw sessionError;

    // 2. Insert Records
    // Get all students to determine who was absent
    const allStudents = await SupabaseDataService.getStudents();
    const records = allStudents.map(student => ({
      session_id: sessionData.id,
      student_id: student.id,
      status: studentIds.includes(student.id) ? 'PRESENT' : 'ABSENT',
      date: new Date().toISOString()
    }));

    const { error: recordsError } = await supabase
      .from('attendance_records')
      .insert(records);

    if (recordsError) throw recordsError;
  }
};