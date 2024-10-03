'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';
import Nav from '../components/nav';

export default function InvitePage() {
  const [loading, setLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canGenerateInvite, setCanGenerateInvite] = useState(false);
  const [invites, setInvites] = useState<any[]>([]); // State to hold the invites
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages

  const invitesPerPage = 5; // Number of invites to display per page

  const router = useRouter();

  const hideFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  };

  const fetchInvites = async (page: number = 1) => {
    setLoading(true);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('No session available:', sessionError);
      setLoading(false);
      return;
    }

    try {
      // Fetch the session user's username and role from the 'public.users' table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username, role')
        .eq('id', session.user.id)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user data:', userError);
        setError('Error fetching user data');
        setLoading(false);
        return;
      }

      // Set the username and role in the state
      setUsername(userData.username);
      setUserRole(userData.role);

      // Fetch total count of invites for pagination
      const { count: totalInvites, error: countError } = await supabase
        .from('invites')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userData.username);

      if (countError) {
        console.error('Error fetching invite count:', countError);
        setError('Error fetching invite count');
        setLoading(false);
        return;
      }

      // Calculate total number of pages
      setTotalPages(Math.ceil(totalInvites! / invitesPerPage));

      // Fetch invites sorted by ID in descending order, limited to 10 invites per page
      const { data: userInvites, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('created_by', userData.username)
        .order('id', { ascending: false })
        .range((page - 1) * invitesPerPage, page * invitesPerPage - 1); // Pagination logic

      if (inviteError) {
        console.error('Error fetching invites:', inviteError);
        setError('Error fetching invites');
      } else {
        setInvites(userInvites); // Update invites state
        setCanGenerateInvite(userData.role === 'admin'); // Set canGenerateInvite based on the user's role
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
      setError('Error fetching invites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hideFooter();
    fetchInvites(currentPage); // Fetch the invites for the current page when the component mounts
  }, [currentPage]); // Fetch invites when currentPage changes

  const generateInvite = async () => {
    setLoading(true);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('No session available:', sessionError);
      setLoading(false);
      return;
    }

    const token = session.access_token; // Extract the access token

    try {
      // Only allow invite generation if the user is an admin
      if (userRole !== 'admin') {
        setError('You do not have permission to generate invites.');
        setLoading(false);
        return;
      }

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
        fetchInvites(currentPage); // After generating the invite, re-fetch the invites to update the UI
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
          <div className="container mx-auto max-w-6xl p-6 border border-4 border-white/20 rounded-lg bg-[#101013]">
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
                  disabled={loading || !canGenerateInvite}
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

            {/* Invite Table */}
            <div className="bg-zinc-900 p-4 rounded-lg mt-4">
              <h2 className="text-2xl font-bold mb-2">Created Invites</h2>
              <div className="border border-4 border-white/20 rounded-lg">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2 border-r border-white/20 text-center">ID</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Invite</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Created By</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Used By</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Created On</th>
                      <th className="text-left p-2 text-center">Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.length > 0 ? (
                      invites.map((invite) => (
                        <tr key={invite.id} className="border-b border-white/20">
                          <td className="p-2 border-r border-white/20">
                            <p className="text-white">
                              <span className="font-bold">{invite.invite_id}</span>
                            </p>
                          </td>
                          <td className="p-2 border-r border-white/20">
                            <p className="text-white">
                              <span className="font-bold">{invite.token}</span>
                            </p>
                          </td>
                          <td className="p-2 border-r border-white/20">
                            <p className="text-white">
                              <span className="font-bold">{invite.created_by}</span>
                            </p>
                          </td>
                          <td className="p-2 border-r border-white/20">
                            <p className="text-white">
                              <a href={`/u/${invite.used_by}`} target='_blank' className="font-bold hover:text-[#BF2E12] text-[#14B90B] transition">{invite.used_by}</a>
                            </p>
                          </td>
                          <td className="p-2 border-r border-white/20">
                            <p className="text-white">
                              <span className="font-bold">{new Date(invite.created_at).toLocaleDateString()}</span>
                            </p>
                          </td>
                          <td className="p-2">
                            <p className="text-white">
                              <span className="font-bold">{invite.used ? '✔️' : '❌'}</span>
                            </p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-2 text-center text-white">No invites found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="mt-4 flex justify-between">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}