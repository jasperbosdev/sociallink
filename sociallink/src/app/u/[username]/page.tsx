'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Correct use of next/navigation in app dir
import { supabase } from '../../supabase'; // Adjust the path if needed
import localFont from "next/font/local"; // Import localFont from next/font/local

import "../../globals.css";

// Load fonts at module scope
const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function UserProfile() {
  const params = useParams(); // Use this to extract dynamic parameters
  const username = params?.username as string; // Type 'username' explicitly as string
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const hideNav = () => {
    const nav = document.getElementById('nav');
    if (nav) {
      nav.style.display = 'none';
    }
  };

  const hideFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  };

  useEffect(() => {
    hideFooter();
    hideNav();
    const fetchUserData = async () => {
      if (username) {
        const { data, error } = await supabase
          .from('users') // Make sure this matches your table
          .select('*')
          .eq('username', username)
          .single();

        if (error) {
          setError('User not found');
        } else {
          setUserData(data);
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-50 text-white">
        <div className="flex flex-col space-y-4 text-center">
          <img src="https://c.tenor.com/4Ob0zR2MXm0AAAAC/tenor.gif" alt="loading" className='rounded-lg max-w-[20em]' />
          <h2 className="text-3xl font-bold">Loading... 🐈🐈</h2>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-50 text-white">
        <div className="flex flex-col space-y-4 text-center">
          <img src="https://c.tenor.com/MUh5wIdD-E0AAAAC/tenor.gif" alt="loading" className='rounded-lg max-w-[20em]' />
          <h2 className="text-3xl font-bold">User not found :(</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-screen bg-black ${geistSans.variable} ${geistMono.variable}`}>
      <div className="flex flex-col items-center space-y-4 p-6 bg-[#101013] border-white/20 border border-4 rounded-lg shadow-lg">
        {/* User Profile Picture */}
        <img 
          src='https://i.pinimg.com/736x/19/a0/37/19a037177b02fd2a8f1de4b671fff286.jpg' 
          className='rounded-full max-w-32' 
          alt={`${userData?.username}'s profile`} 
        />
        {/* User Username */}
        <h1 className="text-3xl font-bold text-center"> 
          {userData?.username}
        </h1>
        {/* Additional User Information */}
        <p className="text-center">Joined on: {new Date(userData?.created_at).toLocaleDateString()}</p>
        {userData?.profile_picture && (
          <img src={userData.profile_picture} alt={`${userData.username}'s profile`} />
        )}
      </div>
    </div>
  );
}