'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';
import Nav from '../components/nav';

export default function InvitePage() {
  const [loading, setLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canGenerateInvite, setCanGenerateInvite] = useState(true); // Track if the user can generate an invite

  const router = useRouter();

  useEffect(() => {
    const checkInviteEligibility = async () => {
      setLoading(true);

      // Get the user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('No session available:', sessionError);
        setLoading(false);
        return;
      }

      const token = session.access_token; // Extract the access token

      try {
        // Check if the user has already generated an invite
        const { data: invites, error: inviteError } = await supabase
          .from('invites')
          .select('id')
          .eq('created_by', session.user.id); // Fetch invites created by the user

        if (inviteError) {
          console.error('Error fetching invites:', inviteError);
          setError('Error fetching invites');
          setLoading(false);
          return;
        }

        // If invites exist, set canGenerateInvite to false
        setCanGenerateInvite(invites.length === 0);
      } catch (error) {
        console.error('Error checking invite eligibility:', error);
        setError('Error checking invite eligibility');
      } finally {
        setLoading(false);
      }
    };

    checkInviteEligibility();
  }, []); // Check eligibility when the component mounts

  const generateInvite = async () => {
    setLoading(true);
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
    if (sessionError || !session) {
      console.error('No session available:', sessionError);
      return;
    }
  
    const token = session.access_token; // Extract the access token
  
    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Pass the token in Authorization header
        },
      });
  
      const result = await response.json();
      
      if (response.ok) {
        console.log('Invite Token:', result.inviteToken);
        setInviteToken(result.inviteToken); // Set the invite token state here
      } else {
        console.error('Error creating invite:', result.error);
        setError(result.error); // Display the error message if any
      }
    } catch (error) {
      console.error('Failed to create invite:', error);
      setError('Failed to create invite'); // Set error state if there's a problem
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex">
        <Nav />
        <div className="flex flex-col justify-center items-center w-full px-4 mt-8">
          <div className="container mx-auto w-2/3 p-6 border border-4 border-white/20 rounded-lg bg-[#101013]">
            <div className="bg-zinc-900 p-4 rounded-lg">
              <h1 className="text-2xl font-bold mb-2">Generate Invite</h1>
              <p className='mb-2'>
                Each user is eligible for 1 invite. If more invites are rolled out, you'll be able to generate more.<br />
                <span className='font-bold'>You are accountable for the actions of the users you invite.</span>
              </p>

              <textarea
                className='bg-black text-white w-full p-2 rounded-lg border border-4 border-white/20 mb-4'
                disabled
                value={inviteToken || 'Invite code will appear here'}
                placeholder='9876543210'
              />

              {error && <p className="text-red-500">{error}</p>}

              <div className="flex space-x-2">
                <button
                  onClick={generateInvite}
                  disabled={loading || !canGenerateInvite} // Disable if loading or user already generated an invite
                  className={`bg-blue-600 text-white py-2 px-4 rounded ${loading || !canGenerateInvite ? 'cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Generating...' : 'Generate Invite'}
                </button>
                <button
                  disabled={!inviteToken}
                  onClick={() => navigator.clipboard.writeText(inviteToken || '')}
                  className={`bg-blue-600 text-white py-2 px-4 rounded ${!inviteToken ? 'cursor-not-allowed' : ''}`}
                >
                  Copy Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}