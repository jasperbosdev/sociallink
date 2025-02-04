'use client';

import ScriptLoader from '../../components/utils/fontawesome';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';

export default function Nav() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/login');
        return;
      }
      
      setUserEmail(session.user?.email || 'No user found');
      
      // Fetch the user role from the public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')  // Make sure the table name is correct
        .select('role')
        .eq('id', session.user?.id)
        .single();
      
      if (userError || !userData) {
        setError('Failed to fetch user role');
        setLoading(false);
        return;
      }

      setUserRole(userData.role);
      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      setError('Failed to log out');
    } else {
      router.push('/login');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* vertical nav container */}
      <div className="flex flex-col lg:w-[6em] border-r-2 lg:border-b-2 border-white/20 h-full w-full lg:space-y-5">
        <div className="flex flex-wrap mt-4 lg:flex-col space-x-3 lg:space-x-0 lg:space-y-5 lg:mt-4 lg:mb-4 items-center justify-center">
          {/* dashboard home */}
          <div
            className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer"
            onClick={() => router.push('/dashboard')}
          >
            <i className="fas fa-home text-white fa-2xl"></i>
          </div>
          <div className="hidden lg:block border border-2 min-w-[56px] border-white/20"></div> {/* divider */}
          {/* dashboard user edit */}
          <div
            className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer"
            onClick={() => router.push('/dashboard/profile')}
          >
            <i className="fas fa-user-edit text-white fa-2xl"></i>
          </div>
          {/* dashboard account settings */}
          <div
            className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer"
            onClick={() => router.push('/dashboard/account')}
          >
            <i className="fas fa-user-cog text-white fa-2xl"></i>
          </div>
          <div className="hidden lg:block border border-2 min-w-[56px] border-white/20"></div> {/* divider */}
          {/* Conditionally render the admin settings button */}
          {userRole === 'admin' && (
            <>
              <div className="text-center font-bold lg:hidden">Admin</div>
              <div
                className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer"
                onClick={() => router.push('/dashboard/admin/badge')}
              >
                <i className="far fa-id-badge text-white fa-2xl"></i>
              </div>
              <div
                className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer"
                onClick={() => router.push('/dashboard/admin/motd')}
              >
                <i className="far fa-message text-white fa-2xl"></i>
              </div>
              <div
                className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer"
                onClick={() => router.push('/dashboard/admin/manage')}
              >
                <i className="fa fa-people-roof text-white fa-2xl"></i>
              </div>
              <div className="hidden lg:block border border-2 min-w-[56px] border-white/20"></div> {/* divider */}
            </>
          )}
          {/* dashboard logout */}
          <div
            className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer"
            onClick={handleLogout}
          >
            <i className="fas fa-arrow-right-from-bracket text-white fa-2xl"></i>
          </div>
        </div>
      </div>
    </>
  );
}