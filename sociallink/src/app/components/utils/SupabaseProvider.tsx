'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabase'; // Adjust the path as needed

interface SupabaseContextType {
  session: any; // You can use a more specific type here if needed
  user: any;    // You can use a more specific type here if needed
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null); // Replace `any` with a specific type if possible
  const [user, setUser] = useState<any>(null); // Replace `any` with a specific type if possible

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={{ session, user }}>
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