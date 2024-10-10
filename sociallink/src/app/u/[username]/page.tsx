'use client';

import { useEffect, useState, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { useUserData } from './util/userDataLogic'; // Import userData logic
import { useFetchAvatar } from './util/fetchAvatar'; // Import fetchAvatar logic
import { useFetchBackground } from './util/fetchBackground'; // Import fetchBackground logic
import localFont from "next/font/local"; // Import localFont from next/font/local
import { useFetchConfig } from './util/fetchConfig';
import { configConsts } from './util/configConsts';
import { useFetchBadges } from './util/fetchBadges';
import { Tooltip } from "@nextui-org/tooltip"; // Import Tooltip from NextUI

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
  const tiltRef = useRef<HTMLDivElement | null>(null);

  const { userData, loading: userLoading, error } = useUserData();
  const { fetchedAvatarUrl, loading: avatarLoading } = useFetchAvatar();
  const { fetchedBackgroundUrl, loading: backgroundLoading } = useFetchBackground();
  const { config, loading: configLoading, error: configError } = useFetchConfig(userData?.uid);
  const { badges, isLoadingBadges } = useFetchBadges();  // Uses the updated fetch logic

  const {
    borderWidth,
    borderRadius,
    cardOpacity,
    cardBlur,
    bgBlurValue,
    bgBrightnessValue,
    usernameFx,
    cardGlow,
    pfpDecoration,
    decorationValue,
    cardTilt,
    showBadges,
  } = configConsts(config);

  useEffect(() => {
    if (cardTilt && tiltRef.current) {
      VanillaTilt.init(tiltRef.current, tiltOptions); // Pass the options here
    }
    // Cleanup effect
    return () => {
      if (tiltRef.current && cardTilt) {
        tiltRef.current.vanillaTilt?.destroy();
      }
    };
  }, [cardTilt]);

  const tiltOptions = {
    reverse: true,
    max: 10,
    perspective: 1500,
    scale: 1,
    transition: true,
    axis: null,
    reset: true,
    glare: false,
    easing: "cubic-bezier(.17,.98,.52,.99)",
    speed: 600,
  }

  // Combine loading states
  const isLoading = userLoading || avatarLoading || configLoading || isLoadingBadges;

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
      {fetchedBackgroundUrl && (
        <aside className={`fixed w-screen h-screen z-[-5] duration-500`}>
          <img
            src={fetchedBackgroundUrl}
            style={{
              filter: `blur(${bgBlurValue}) brightness(${bgBrightnessValue})`  // Apply both blur and brightness dynamically
            }}
            className="object-cover w-full h-full"
            alt=""
            draggable="false"
          />
        </aside>
      )}
      <div className={`transition flex items-center justify-center min-h-screen mx-4 ${geistSans.variable} ${geistMono.variable}`}>
      <div
        ref={(el) => {
          if (el && cardTilt) {
            // Initialize VanillaTilt only if cardTilt is true
            VanillaTilt.init(el, {
              max: 5,
              speed: 2000,
              glare: false,
              reverse: true,
              transition: true,
              easing: "cubic-bezier(.03,.98,.52,.99)",
              reset: true,
            });
          } else if (el && !cardTilt && el.vanillaTilt) {
            // Destroy VanillaTilt if cardTilt is false or null
            el.vanillaTilt.destroy();
          }
        }}
        className={`relative flex w-full max-w-[45em] flex-col items-center space-y-4 p-6 border-red-500 shadow-lg ${cardBlur}`}
        style={{
          borderWidth: borderWidth,
          borderRadius: borderRadius,
          backgroundColor: `rgba(0, 0, 0, ${cardOpacity})`,
          boxShadow: cardGlow ? `0px 0px 10px 4px rgba(239,68,68,1)` : "",
        }}
      >
        <div className="relative flex flex-col items-center">
          {pfpDecoration ? (
            <>
              <img
                src={`/static/assets/decorations/${decorationValue}.png`} // Dynamic decoration image
                className="w-40 h-auto"
                alt={`${userData?.username}'s decoration`}
                draggable="false"
              />
              <img
                src={`${fetchedAvatarUrl}?v=${userData?.pfp_vers}`}
                className="absolute bottom-[18px] rounded-full w-32 h-32 object-cover border-[3px] border-red-500 mt-[-2rem]"
                alt={`${userData?.username}'s profile`}
                draggable="false"
              />
            </>
          ) : (
            <img
              src={`${fetchedAvatarUrl}?v=${userData?.pfp_vers}`}
              className="w-32 h-32 object-cover border-[3px] border-red-500 rounded-full"
              alt={`${userData?.username}'s profile`}
              draggable="false"
            />
          )}
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <h1
            className="text-3xl font-bold text-center"
            style={{
              backgroundImage: usernameFx ? "url('/static/assets/textFx/fxWhite.gif')" : "none",
            }}
          >
            {userData?.username}
          </h1>
          
          {showBadges && (
            <span className="flex items-center space-x-2 h-full">
              {badges.map((badge, index) => (
                <Tooltip key={badge.id || index} content={
                  <div className='font-bold text-sm'>{badge.badge}</div>
                }>
                    <i
                    className={`${badge.icon_style} fa-${badge.icon}`}
                    style={{ filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 3.5px)' }}
                    ></i>
                </Tooltip>
              ))}
            </span>
          )}
        </div>
        <p className="text-center">Joined on: {new Date(userData?.created_at).toLocaleDateString()}</p>
      </div>
      </div>
    </>
  );
}