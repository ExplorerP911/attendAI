export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institution?: string; // For teachers
  usn?: string; // For students
  course?: string; // For students
}

export interface Student extends User {
  role: UserRole.STUDENT;
  usn: string;
  attendanceRate: number;
}

export interface AttendanceSession {
  id: string;
  date: string;
  className: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  status: 'COMPLETED' | 'PROCESSING';
  imageUrl?: string;
  aiAnalysis?: AIAnalysisResult;
}

export interface AIAnalysisResult {
  studentCount: number;
  confidenceScore: number;
  description: string;
  detectedStudents: string[]; // List of IDs
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: 'PRESENT' | 'ABSENT';
  date: string;
}

// Gemini specific types
export interface GeminiAnalysisResponse {
  count: number;
  description: string;
  confidence: number;
  isClassroom: boolean;
}