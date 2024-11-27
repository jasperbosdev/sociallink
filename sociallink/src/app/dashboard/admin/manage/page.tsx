'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabase';
import Nav from '../../components/nav';

export default function InvitePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  const router = useRouter();
  const [highPrivUsers, setHighPrivUsers] = useState<[]>([]);
  const [allUsers, setAllUsers] = useState('');

  const hideFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  };

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
      router.push('/not-authorized'); // Redirect to not authorized if not admin
      return;
    }

    setIsAdmin(true); // Mark as admin
    setLoading(false); // Stop the loading state
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  const fetchHighPrivUsers = async () => {
    setLoading(true);
    const { data: highPrivUsers, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin');

    if (error) {
      setError('Failed to fetch users with higher privileges');
      setLoading(false);
      return;
    }

    setHighPrivUsers(highPrivUsers);
    console.log('Users with a high privilege', highPrivUsers);
    setLoading(false);
  };

  const fetchAllUsers = async () => {
    setLoading(true);
  
    const { data: allUsers, error } = await supabase
      .from('users')
      .select('*')
      .order('uid', { ascending: true }); // Sort by UID in descending order
  
    if (error) {
      setError('Failed to fetch all users');
      setLoading(false);
      return;
    }
  
    setAllUsers(allUsers);
    console.log('All users', allUsers);
    setLoading(false);
  };  

  useEffect(() => {
    if (isAdmin) {
      fetchHighPrivUsers();
      fetchAllUsers();
    }
  }, [isAdmin]);

  const toggleUserHidden = async (userId: string, currentHiddenStatus: boolean) => {
    setLoading(true); // Indicate loading state
    setError(null); // Reset error state
  
    try {
      const newHiddenStatus = !currentHiddenStatus;
  
      const { error: updateError } = await supabase
        .from('users')
        .update({ hidden: newHiddenStatus })
        .eq('id', userId);
  
      if (updateError) {
        throw new Error('Failed to update hidden status');
      }
  
      // Update the state to reflect the change
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, hidden: newHiddenStatus } : user
        )
      );
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch the session's user role
  const checkUserRole = async () => {
    const { data: sessionData, error } = await supabase.auth.getSession();

    if (error) {
      setError('Failed to fetch session');
      return;
    }

    const { data: userRoleData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', sessionData?.session?.user?.id);

    if (roleError) {
      setError('Failed to fetch user role');
      return;
    }

    // Check if the user has an 'admin' role
    if (userRoleData && userRoleData[0]?.role === 'admin') {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    hideFooter();
    checkUserRole();
  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while checking admin status
  }

  return (
    <>
      <div className="flex">
        <Nav />
        <div className="flex flex-col justify-center items-center w-full px-4 mt-8">
          <div className="container mx-auto max-w-6xl p-6 border border-4 border-white/20 rounded-lg bg-[#101013]">
            <div className="flex flex-row space-x-4">
              <div className="bg-zinc-900 p-4 rounded-lg">
                <h1 className="text-2xl font-bold mb-2">User Management</h1>
                <p>Disable, hide profiles and remove unwanted content.<br /></p>
              </div>

              {/* Existing Badges Table */}
              <div className="bg-zinc-900 p-4 rounded-lg flex-1">
                <h2 className="text-2xl font-bold mb-2">Users with higher privileges</h2>
                <div className="border border-4 border-white/20 rounded-lg">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-2 border-r border-white/20 text-center">UID</th>
                        <th className="text-left p-2 border-r border-white/20 text-center">User</th>
                        <th className="text-left p-2 text-center">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!loading && highPrivUsers.length > 0 ? (
                        highPrivUsers.map((highPrivUser) => (
                          <tr key={highPrivUser.uid} className="border-b border-white/20">
                            <td className="p-2 border-r border-white/20">
                              <p className="text-white"><span className="font-bold">{highPrivUser.uid}</span></p>
                            </td>
                            <td className="p-2 border-r border-white/20">
                              <p className="text-white">
                                <span className="font-bold">
                                {highPrivUser.username}
                                </span>
                              </p>
                            </td>
                            <td className="p-2">
                              <p className="text-white"><span className="font-bold">{highPrivUser.role}</span></p>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-2 text-white">
                            {loading ? 'Loading badges...' : 'No high privilege users available'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Badge Users Table */}
            <div className="bg-zinc-900 p-4 rounded-lg mt-4">
              <h2 className="text-2xl font-bold mb-2">Users</h2>
              <div className="border border-4 border-white/20 rounded-lg">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2 border-r border-white/20 text-center">UID</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Role</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Email</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Username</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Join Date</th>
                      <th className="text-left p-2 text-center border-r border-white/20">Hidden</th>
                      <th className="text-left p-2 text-center border-r border-white/20">Delete Uploads</th>
                      <th className="text-center p-2">Reset Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && allUsers.length > 0 ? (
                      allUsers.map((allUser) => (
                        <tr key={allUser.id} className="border-b border-white/20">
                          <td className="p-2 border-r border-white/20 text-center">{allUser.uid}</td>
                          <td className="p-2 border-r border-white/20 text-center">{allUser.role}</td>
                          <td className="p-2 border-r border-white/20 text-center">{allUser.email}</td>
                          <td className="p-2 border-r border-white/20 text-center">{allUser.username}</td>
                          <td className="p-2 border-r border-white/20 text-center">{new Date(allUser.created_at).toLocaleString()}</td>
                          <td className="p-2 border-r border-white/20 text-center">
                            <div
                              className="flex justify-center items-center cursor-pointer p-1 bg-green-600 border-2 border-green-900 rounded-xl"
                              onClick={() => {
                                const confirmAction = window.confirm(
                                  `Are you sure you want to ${allUser.hidden ? 'unhide' : 'hide'} ${allUser.username}'s profile?`
                                );
                                if (confirmAction) {
                                  toggleUserHidden(allUser.id, allUser.hidden);
                                }
                              }}
                            >
                              {allUser.hidden ? 'Unhide 👨‍🦯' : 'Hide 👁️'}
                            </div>
                          </td>
                          <td className="p-2 border-r border-white/20 text-center"><div className='cursor-pointer p-1 bg-red-600 border-2 border-red-900 rounded-xl'>Delete 🗑️</div></td>
                          <td className="p-2 text-center"><div className='cursor-pointer p-1 bg-red-600 border-2 border-red-900 rounded-xl'>Reset 🔄</div></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-2 text-white">
                          {loading ? 'Loading users...' : 'No users found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}