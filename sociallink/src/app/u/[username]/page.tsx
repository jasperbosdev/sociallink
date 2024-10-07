'use client';

import { useEffect } from 'react';
import { useUserData } from './util/userDataLogic'; // Import userData logic
import { useFetchAvatar } from './util/fetchAvatar'; // Import fetchAvatar logic
import { useFetchBackground } from './util/fetchBackground'; // Import fetchBackground logic
import localFont from "next/font/local"; // Import localFont from next/font/local
import { useFetchConfig } from './util/fetchConfig';

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
  const { userData, loading: userLoading, error } = useUserData();
  const { fetchedAvatarUrl, loading: avatarLoading } = useFetchAvatar();
  const { fetchedBackgroundUrl, loading: backgroundLoading } = useFetchBackground();
  const { config, loading: configLoading, error: configError } = useFetchConfig(userData?.uid); // Pass UID to fetchConfig

  // Combine loading states
  const isLoading = userLoading || avatarLoading || configLoading;

  // Log fetched data
  if (config) {
    console.log("Fetched config data:", config);
  }

  // config variable definitions
  const borderWidth = (config?.border_width !== undefined && config.border_width !== null) 
  ? `${config.border_width}px` 
  : '3px';

  const borderRadius = (config?.border_radius !== undefined && config.border_radius !== null) 
  ? `${config.border_radius}rem` 
  : '0.5rem';

  const cardOpacity = (config?.card_opacity !== undefined && config.card_opacity !== null)
    ? config.card_opacity / 100 
    : 0.9;

  const cardBlur = (config?.card_blur !== undefined && config.card_blur !== null)
  ? `backdrop-blur-[${config.card_blur}px]`
  : 'backdrop-blur-[0px]';

  if (isLoading) {
    return (
      <div className={`transition flex flex-col fixed inset-0 flex items-center justify-center bg-black z-50 text-white ${geistSans.variable} ${geistMono.variable}`}>
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
    <>
      <aside className='fixed w-screen h-screen z-[-5] duration-500'> {/* Change z-index */}
        <img
          src={fetchedBackgroundUrl}
          className='object-cover w-full h-full'
          alt=''
          draggable='false'
        />
      </aside>
      <div className={`transition flex items-center justify-center min-h-screen mx-4 ${geistSans.variable} ${geistMono.variable}`}>
        <div 
          className={`flex w-full max-w-[45em] flex-col items-center space-y-4 p-6 border-red-500 shadow-lg ${cardBlur}`}
          style={{ borderWidth: borderWidth, borderRadius: borderRadius, backgroundColor: `rgba(0, 0, 0, ${cardOpacity})` }}>
          {/* User Profile Picture */}
          <img
            src={`${fetchedAvatarUrl}?v=${userData?.pfp_vers}`}
            className='rounded-full max-w-32 max-h-32 w-32 h-32 object-cover border-[3px] border-red-500'
            alt={`${userData?.username}'s profile`}
            draggable='false'
          />
          {/* User Username */}
          <h1 className="text-3xl font-bold text-center"> 
            {userData?.username}
          </h1>
          {/* Additional User Information */}
          <p className="text-center">Joined on: {new Date(userData?.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </>
  );
}