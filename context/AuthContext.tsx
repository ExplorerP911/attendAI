import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase, SupabaseAuthService } from '../services/supabaseService';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole, password?: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session on load
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch full profile
          const userDetails = await SupabaseAuthService.login(session.user.email!, UserRole.TEACHER); // Role is fetched from DB inside service
          setUser(userDetails);
        }
      } catch (error) {
        console.error("Session check failed", error);
        localStorage.removeItem('attend_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
         // Optionally refresh user data here
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, role: UserRole, password?: string) => {
    if (!password) throw new Error("Password required");
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      
      const userData = await SupabaseAuthService.login(email, role);
      setUser(userData);
      localStorage.setItem('attend_user', JSON.stringify(userData)); // Keep for legacy fallback
    } catch (error: any) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
      setIsLoading(true);
      try {
          const newUser = await SupabaseAuthService.register(email, password, userData);
          setUser(newUser);
      } catch (error: any) {
          console.error("Registration failed", error);
          throw error;
      } finally {
          setIsLoading(false);
      }
  }

  const logout = async () => {
    await SupabaseAuthService.logout();
    setUser(null);
    localStorage.removeItem('attend_user');
    window.location.hash = ''; 
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};