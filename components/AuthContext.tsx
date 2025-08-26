import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { supabase } from '../services/supabaseClient';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<{ error: Error | null }>;
  register: (name: string, studentId: string, email: string, password: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return profile as User;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    const checkInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if(session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            setUser(profile);
        }
        setLoading(false);
    }
    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error || null };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    return { error: error || null };
  };

  const register = async (name: string, studentId: string, email: string, password: string) => {
    // IMPORTANT: For this to work seamlessly, you should create a trigger in your 
    // Supabase SQL editor to automatically create a public.profiles row when a new 
    // auth.users entry is created. This ensures user data is consistent.
    // See Supabase docs for "handle_new_user" trigger function examples.

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          student_id: studentId,
          // The trigger will use this metadata to populate the profiles table.
        }
      }
    });
    // By default, Supabase requires email confirmation. The onAuthStateChange listener
    // will pick up the user session after they click the confirmation link.
    return { error: error || null };
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
