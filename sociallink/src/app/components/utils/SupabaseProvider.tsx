'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabase'; // Adjust the path as needed

interface SupabaseContextType {
  session: any; // Replace `any` with a specific type, e.g., `Session | null` if using Supabase types
  user: any; // Replace `any` with `User | null` for better type safety
  logout: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log('Auth state changed:', event, session);

      if (event === 'TOKEN_REFRESHED') {
        // Force logout when token is refreshed
        handleLogout();
      } else {
        setSession(session);
        setUser(session?.user || null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Token refreshed, forcing logout...');
  
      // List of paths where logout should redirect to /login
      const restrictedPaths = ['/dashboard', '/u'];
  
      // Check the current path
      const currentPath = window.location.pathname;
  
      // Only redirect to /login if the current path starts with a restricted path
      const shouldRedirect =
        restrictedPaths.some((path) => currentPath.startsWith(path));
  
      // Perform logout
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
  
      // Redirect to /login if necessary
      if (shouldRedirect) {
        window.location.href = '/login';
      } else {
        // console.log('Token refreshed, but staying on the current page.');
      }
    } catch (error) {
      console.error('Error during forced logout:', error);
    }
  };  

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <SupabaseContext.Provider value={{ session, user, logout }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}