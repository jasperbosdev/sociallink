'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabase'; // Adjust import path if necessary

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/login');
        return;
      }
      setUserEmail(session.user?.email || 'No user found');
      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError('Failed to log out');
    } else {
      router.push('/login');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className='text-white'>
        {userEmail ? `Welcome, ${userEmail}` : 'No user found'}
      </div>
      <button
        className='text-white mt-4 px-4 py-2 bg-indigo-500 rounded'
        onClick={handleLogout}
      >
        Logout
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}