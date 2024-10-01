'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '.././supabase';

export default function SetMOTDPage() {
  const [motd, setMOTD] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/login'); // Redirect to login if no session
        return;
      }

      const { data: userRole } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userRole?.role !== 'admin') {
        router.push('/not-authorized'); // Redirect if not admin
      }
    };

    checkAdmin();
  }, [router]);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
  
        try {
          // Get the session and extract the access_token
          const {
            data: { session },
          } = await supabase.auth.getSession();
      
          if (!session) {
            setError('No valid session found');
            return;
          }
      
          const token = session.access_token;
      
          const response = await fetch('/api/set-motd', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Add the token in the Authorization header
            },
            body: JSON.stringify({ motd }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to set MOTD');
          }
      
          setSuccess('MOTD updated successfully!');
        } catch (err) {
          setError('Error updating MOTD');
        } finally {
          setLoading(false);
        }
    };

  return (
    <div className="container mx-auto w-2/3 p-6">
      <h1 className="text-2xl font-bold mb-4">Set Message of the Day</h1>
      
      <textarea
        value={motd}
        onChange={(e) => setMOTD(e.target.value)}
        className="w-full p-2 mb-4 border rounded text-black"
        rows={5}
        placeholder="Enter the Message of the Day..."
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        {loading ? 'Saving...' : 'Save MOTD'}
      </button>
    </div>
  );
}