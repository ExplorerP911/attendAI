// This file now re-exports the Supabase implementation to avoid breaking imports
// In a full refactor, we would rename this file and update all import paths.
import { SupabaseAuthService, SupabaseDataService } from './supabaseService';
import { UserRole, User } from '../types';

export const MockAuthService = {
    login: async (identifier: string, role: UserRole): Promise<User> => {
        // The real auth flow happens in the AuthContext/Component. 
        // This is kept for compatibility if any legacy code calls it directly, 
        // but mostly we will bypass this.
        return SupabaseAuthService.login(identifier, role);
    },
    register: SupabaseAuthService.register
};

export const MockDataService = SupabaseDataService;