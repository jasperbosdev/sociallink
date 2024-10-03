'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabase';
import Nav from './components/nav';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [uid, setUID] = useState<string | null>(null);
  const [created_at, setCreatedAt] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [totalUsers, setTotalUsers] = useState<any>(null);
  const [totalInvited, setTotalInvited] = useState<any>(null);
  const [motd, setMOTD] = useState<string | null>(null);
  const [MOTDCreatedAt, setMOTDCreatedAt] = useState<string | null>(null);
  const [invitedUsers, setInvitedUsers] = useState<any[]>([]); // New state for invited users

  const router = useRouter();

  const hideFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  };

  const fetchInvitedUsers = async (sessionUsername: string) => {
    console.log("Fetching invited users for:", sessionUsername);  // Added log
  
    // Fetch only invites that have been used (i.e., used_by is not null)
    const { data, error } = await supabase
      .from('invites')
      .select('used_by')
      .eq('created_by', sessionUsername)
      .not('used_by', 'is', null); // Exclude NULL 'used_by' values
  
    if (error) {
      console.error('Error fetching invited users:', error);
    } else {
      console.log('Fetched invited users:', data);  // Log the data
      setInvitedUsers(data || []);
    }
  };

  const fetchTotalInvited = async (sessionUsername: string) => {
    try {
      // Query to count invites where the 'created_by' is the session user and 'used_by' is not NULL
      const { count, error } = await supabase
        .from('invites')
        .select('used_by', { count: 'exact' }) // Count invites where 'used_by' is not NULL
        .eq('created_by', sessionUsername)
        .not('used_by', 'is', null); // Exclude NULL 'used_by' values
  
      if (error) {
        console.error('Error fetching total invited users:', error);
        setError('Error fetching total invited users');
      } else {
        setTotalInvited(count); // Set the count in the state
      }
    } catch (err) {
      console.error('Error during fetch:', err);
      setError('Error fetching total invited users');
    }
  };

  useEffect(() => {
    hideFooter();

    const checkSessionAndFetchUserData = async () => {
      setLoading(true);
    
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session Error:', sessionError);
        router.push('/login');
        return;
      }
    
      const userId = session.user.id;
    
      try {
        const [publicUserResponse, totalUsersResponse] = await Promise.all([
          supabase.from('users').select('*').eq('id', userId).single(),
          supabase.from('users').select('uid'),
        ]);
    
        if (publicUserResponse.error) {
          console.error('Error fetching public user:', publicUserResponse.error);
          setError('Error fetching user from public.users');
          setLoading(false);
          return;
        }
    
        const publicUserData = publicUserResponse.data;
        setUsername(publicUserData?.username || 'No username found');
        setUID(publicUserData?.uid || 'No uid found');
        setCreatedAt(publicUserData?.created_at || 'No date found');
        setUserData(publicUserData);
    
        if (totalUsersResponse.error) {
          console.error('Error fetching total users:', totalUsersResponse.error);
          setError('Error fetching total users');
          setLoading(false);
          return;
        }
    
        setTotalUsers(totalUsersResponse.data.length);
    
        // Fetch invited users
        if (publicUserData?.username) {
          fetchInvitedUsers(publicUserData.username);
          fetchTotalInvited(publicUserData.username); // Fetch total invited users
        }
      } catch (err) {
        console.error('Error during data fetching:', err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    const fetchMOTD = async () => {
      const { data: motdData, error } = await supabase.from('motd').select('message, created_at').single();
      if (motdData) {
        setMOTD(motdData.message);
        setMOTDCreatedAt(motdData.created_at);
      } else {
        console.error('Error fetching MOTD:', error);
        setError('Error fetching MOTD');
      }
    };

    fetchMOTD();
    checkSessionAndFetchUserData();
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
    <>
      <div className="flex">
        <Nav />
        <div className="flex flex-col justify-center items-center w-full px-4 mt-8">
          {/* dashboard card */}
          <div className="bg-[#101013] rounded-lg w-full relative sm:p-4 p-2 mb-4 max-w-6xl border border-4 rounded-xl border-white/20">
            <h1 className="font-bold text-center md:text-3xl text-xl pt-2 pb-4">
              {username ? `Welcome, ${username} 👋` : 'No username found'}
            </h1>
            <div className="flex md:flex-row flex-col mx-4 gap-4">
              {/* userdata grid */}
              <ul className="grid min-[1350px]:grid-cols-2 grid-cols-1 gap-4 md:w-1/3 w-full">
                <li className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 items-center justify-center w-full rounded-lg flex flex-col">
                  <h1 className="text-white font-bold text-center min-[1450px]:text-xl text-lg">User ID</h1>
                  <p className="text-white text-center min-[1450px]:text-xl text-lg">{uid ? `${uid}` : 'No UID found'}</p>
                </li>
                <li className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 items-center justify-center w-full rounded-lg flex flex-col">
                  <h1 className="text-white font-bold text-center min-[1450px]:text-xl text-lg">Invited Users</h1>
                  <p className="text-white text-center min-[1450px]:text-xl text-lg">{totalInvited !== null ? `${totalInvited}` : 'Total not found'}</p>
                </li>
                <li className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 items-center justify-center w-full rounded-lg flex flex-col">
                  <h1 className="text-white font-bold text-center min-[1450px]:text-xl text-lg">Total Users</h1>
                  <p className="text-white text-center min-[1450px]:text-xl text-lg">{totalUsers ? `${totalUsers}` : 'Total not found'}</p>
                </li>
                <li className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 items-center justify-center w-full rounded-lg flex flex-col">
                  <h1 className="text-white font-bold text-center min-[1450px]:text-xl text-lg">Join Date</h1>
                  <p className="text-white text-center min-[1450px]:text-xl text-lg">{created_at ? `${created_at.split('T')[0]}` : 'No date found'}</p>
                </li>
                {/* Add more user data items here */}
              </ul>
              <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 md:w-1/3 w-full rounded-md p-4 relative">
                <h1 className="text-white font-bold text-xl pb-2">MOTD</h1>
                <p className="text-white text-base">{motd ? `${motd}` : 'Error fetching MOTD' }</p>
                <p className="text-white text-sm absolute bottom-[3%] right-[3%]">Last updated: {MOTDCreatedAt ? `${MOTDCreatedAt.split('T')[0]}` : 'Error fetching MOTD date' }</p>
              </div>
              <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 md:w-1/3 w-full rounded-md p-4">
                <h1 className="text-white font-bold text-xl pb-2">Manage Invites</h1>
                <div className="flex flex-col">
                  {invitedUsers.length > 0 ? (
                    <select className="bg-zinc-800 py-[7px] text-white rounded-md my-1 border-[3px] border-white/20 font-bold rounded-lg text-start pl-2">
                      {invitedUsers.map((user) => (
                        <option key={user.used_by} value={user.used_by}>
                          {user.used_by}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="bg-zinc-800 py-[7px] text-white rounded-md my-1 border-[3px] border-white/20 font-bold rounded-lg text-start pl-2">
                      No users invited yet
                    </div>
                  )}
                  <div className="bg-blue-700 py-[7px] text-white rounded-md my-1 border-blue-400 border-[3px] font-bold rounded-lg text-center cursor-pointer hover:scale-[1.02] transition"
                    onClick={() => router.push('/dashboard/invite')}>
                    Manage Invites
                  </div>
                </div>
              </div>
            </div>
            <div className="flex lg:flex-row flex-col gap-4 mx-4 my-4">
              <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-300 lg:w-1/2 w-full rounded-md p-4">
                <h1 className="text-white font-bold text-xl pb-2 text-center">System Graph</h1>
                <div className="py-20 text-center">example</div>
              </div>
              <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-300 lg:w-1/2 w-full rounded-md p-4">
                <h1 className="text-white font-bold text-xl pb-2 text-center">System Graph</h1>
                <div className="py-20 text-center">example</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}