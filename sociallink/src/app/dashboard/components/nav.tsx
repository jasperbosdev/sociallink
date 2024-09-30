'use client';

import ScriptLoader from '../../components/utils/fontawesome';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';

export default function Nav() {

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
        <>
            {/* vertical nav container */}
            <div className="flex w-[6em] justify-center border-r-2 border-b-2 border-white/20 h-full">
                <div className="flex flex-col space-y-5 mt-4 mb-4">
                    {/* dashboard home */}
                    <div className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer">
                        <i className="fas fa-home text-white fa-2xl"></i>
                    </div>
                    <div className="border border-2 border-white/20"></div> {/* divider */}
                    {/* dashboard user edit */}
                    <div className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer">
                        <i className="fas fa-user-edit text-white fa-2xl"></i>
                    </div>
                    {/* dashboard account settings */}
                    <div className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer">
                        <i className="fas fa-user-cog text-white fa-2xl"></i>
                    </div>
                    <div className="border border-2 border-white/20"></div> {/* divider */}
                    {/* dashboard logout */}
                    <div className="bg-white/20 border border-[3px] border-white/20 rounded-xl flex justify-center items-center w-14 h-14 hover:scale-[1.075] transition cursor-pointer" onClick={handleLogout}>
                        <i className="fas fa-arrow-right-from-bracket text-white fa-2xl"></i>
                    </div>
                </div>
            </div>
        </>
    );
}