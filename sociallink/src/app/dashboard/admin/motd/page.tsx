'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabase';
import Nav from '../../components/nav';

export default function SetMOTDPage() {
  const [motd, setMOTD] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Set to true initially
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const hideFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  }

  // Check if user is admin
  useEffect(() => {
    hideFooter();
    const checkAdmin = async () => {
      setLoading(true); // Start the loading state
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        router.push('/login'); // Redirect to login if no session
        return;
      }

      const { data: userRole, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (roleError || userRole?.role !== 'admin') {
        router.push('/not-authorized'); // Redirect to login if not admin
        return;
      }

      setLoading(false); // Stop the loading state if admin check passes
    };

    checkAdmin();
  }, [router]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('No valid session found');
        return;
      }

      const token = session.access_token;

      const response = await fetch('/api/set-motd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

  if (loading) {
    return <div>Loading...</div>; // Display loading message while checking admin status
  }

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <Nav />
        <div className="container mx-auto w-2/3 p-6 border border-4 border-white/20 rounded-lg bg-[#101013]">
          <h1 className="text-2xl font-bold mb-4">Set Message of the Day</h1>

          <textarea
            value={motd}
            onChange={(e) => setMOTD(e.target.value)}
            className="w-full p-2 mb-4 border-4 border-white/20 rounded-lg text-white bg-black"
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
      </div>
    </>
  );
}