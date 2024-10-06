'use client';

import { useEffect } from 'react';
import { useUserData } from './util/userDataLogic'; // Import userData logic
import { useFetchAvatar } from './util/fetchAvatar'; // Import fetchAvatar logic
import localFont from "next/font/local"; // Import localFont from next/font/local

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
  const { userData, loading, error } = useUserData();
  const { fetchedAvatarUrl, isAvatarLoading } = useFetchAvatar();

  // Check for loading or error states
  if (loading || isAvatarLoading) {
    return (
      <div className={`flex flex-col fixed inset-0 flex items-center justify-center bg-black z-50 text-white ${geistSans.variable} ${geistMono.variable}`}>
        <div className="border border-4 border-white/20 bg-[#101013] py-2 px-10 rounded-lg text-center">
          <img className='max-w-64 rounded-lg mt-4 mb-4' src='https://c.tenor.com/4Ob0zR2MXm0AAAAC/tenor.gif' />
          <h2 className="text-2xl font-bold">Loading... 🐈🐈</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-50 text-white">
        <h2 className="text-3xl font-bold">User not found :(</h2>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-screen bg-black ${geistSans.variable} ${geistMono.variable}`}>
      <div className="flex flex-col items-center space-y-4 p-6 bg-[#101013] border-white/20 border border-4 rounded-lg shadow-lg">
        {/* User Profile Picture */}
        <img 
          src={fetchedAvatarUrl} 
          className='rounded-full max-w-32' 
          alt={`${userData?.username}'s profile`} 
        />
        {/* User Username */}
        <h1 className="text-3xl font-bold text-center"> 
          {userData?.username}
        </h1>
        {/* Additional User Information */}
        <p className="text-center">Joined on: {new Date(userData?.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
