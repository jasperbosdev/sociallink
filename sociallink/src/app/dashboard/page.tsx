'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabase';
import Nav from './components/nav';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [created_at, setCreatedAt] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  const hideFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  }



  useEffect(() => {
    hideFooter();
    const checkSessionAndFetchUserData = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session Error:', sessionError);
        router.push('/login');
        return;
      }

      const { data: publicUserData, error: publicUserError } = await supabase
        .from('users')
        .select('*')
        .single();

      if (publicUserError) {
        console.error('Error fetching public user:', publicUserError);
        setError('Error fetching user from public.users');
        setLoading(false);
        return;
      }

      setUsername(publicUserData?.username || 'No username found');
      setCreatedAt(publicUserData?.created_at || 'No date found');
      setUserData(publicUserData);
      setLoading(false);
    };

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
                <li className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 p-2 items-center justify-center w-full rounded-lg flex flex-col">
                  <h1 className="text-white font-bold text-center min-[1450px]:text-xl text-lg">User Data 1</h1>
                  <p className="text-white text-center min-[1450px]:text-xl text-lg">123456789</p>
                </li>
                <li className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 p-2 items-center justify-center w-full rounded-lg flex flex-col">
                  <h1 className="text-white font-bold text-center min-[1450px]:text-xl text-lg">User Data 2</h1>
                  <p className="text-white text-center min-[1450px]:text-xl text-lg">{created_at ? `${created_at.split('T')[0]}` : 'No date found'}</p>
                </li>
                <li className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 p-2 items-center justify-center w-full rounded-lg flex flex-col">
                  <h1 className="text-white font-bold text-center min-[1450px]:text-xl text-lg">User Data 3</h1>
                  <p className="text-white text-center min-[1450px]:text-xl text-lg">123456789</p>
                </li>
                <li className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 p-2 items-center justify-center w-full rounded-lg flex flex-col">
                  <h1 className="text-white font-bold text-center min-[1450px]:text-xl text-lg">Join Date</h1>
                  <p className="text-white text-center min-[1450px]:text-xl text-lg">{created_at ? `${created_at.split('T')[0]}` : 'No date found'}</p>
                </li>
                {/* Add more user data items here */}
              </ul>
              <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 md:w-1/3 w-full rounded-md p-4">
                <h1 className="text-white font-bold text-xl pb-2">MOTD</h1>
                <p className="text-white text-base">hello pookie</p>
              </div>
              <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 md:w-1/3 w-full rounded-md p-4">
                <h1 className="text-white font-bold text-xl pb-2">Manage Invites</h1>
                <p className="text-white text-base">Example</p>
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
