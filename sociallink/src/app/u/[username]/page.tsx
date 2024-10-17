'use client';

import { useEffect, useState, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { useUserData } from './util/userDataLogic';
import { useFetchAvatar } from './util/fetchAvatar';
import { useFetchBackground } from './util/fetchBackground';
import localFont from "next/font/local";
import { useFetchConfig } from './util/fetchConfig';
import { configConsts } from './util/configConsts';
import { useFetchGeneralConfig } from './util/fetchGeneralConfig';
import { generalConfigConsts } from './util/generalConfigConsts';
import { useFetchBadges } from './util/fetchBadges';
import { useFetchSocials } from './util/fetchSocials';
import { Tooltip } from "@nextui-org/tooltip";
import { TypeAnimation } from 'react-type-animation';
import { profile } from 'console';

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

const Minecraftia = localFont({
  src: "../../fonts/Minecraftia.ttf",
  variable: "--font-minecraftia",
  weight: "normal",
});

const Poppins = localFont({
  src: "../../fonts/Poppins-SemiBold.ttf",
  variable: "--font-poppins",
  weight: "100 900",
});

export default function UserProfile() {
  const tiltRef = useRef<HTMLDivElement | null>(null);

  const { userData, loading: userLoading, error } = useUserData();
  const { fetchedAvatarUrl, loading: avatarLoading } = useFetchAvatar();
  const { fetchedBackgroundUrl, loading: backgroundLoading } = useFetchBackground();
  const { config, loading: configLoading, error: configError } = useFetchConfig(userData?.uid);
  const { generalConfig, loading: generalConfigLoading, error: generalConfigError } = useFetchGeneralConfig(userData?.uid);
  const { badges, isLoadingBadges } = useFetchBadges();
  const { socials, isLoadingSocials } = useFetchSocials();

  const [isPageLoaded, setIsPageLoaded] = useState(false);

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
    fullRoundedSocials,
    primaryColor,
    secondaryColor,
    accentColor,
    textColor,
    embedColor,
    backgroundColor,
    profileFont,
    usernameFxColor,
  } = configConsts(config);

  const {
    pageTitle,
    displayName,
    description,
    animatedTitle,
    typingDesc
  } = generalConfigConsts(generalConfig);

  useEffect(() => {
    if (pageTitle) {
      const originalTitle = document.title;
      if (animatedTitle) {
        let titleIndex = 0;
        const scrollTitle = () => {
          document.title = pageTitle.slice(titleIndex) + " " + pageTitle.slice(0, titleIndex);
          titleIndex = (titleIndex + 1) % pageTitle.length;
        };
        const titleInterval = setInterval(scrollTitle, 100);

        return () => {
          clearInterval(titleInterval);
          document.title = originalTitle;
        };
      } else {
        document.title = pageTitle;
      }
    }
  }, [pageTitle, animatedTitle]);

  useEffect(() => {
    if (cardTilt && tiltRef.current) {
      VanillaTilt.init(tiltRef.current, tiltOptions);
    }
    return () => {
      if (tiltRef.current && cardTilt) {
        tiltRef.current.vanillaTilt?.destroy();
      }
    };
  }, [cardTilt]);

  useEffect(() => {
    const handleLoad = () => {
      setIsPageLoaded(true); // Set page as loaded once the window finishes loading
    };
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const username = userData?.username;

  useEffect(() => {
    if (username) {
      trackView(username as string);  // Track the view when the page loads
    }
  }, [username]);

  const trackView = async (username: string) => {
    try {
      const res = await fetch('/api/trackView', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      // console.log(data.message);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

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
      <style jsx global>{`
        body {
          font-family: var(--font-${profileFont}) !important;
          font-weight: 500;
        }
      `}</style>
      {fetchedBackgroundUrl ? (
        <aside className={`fixed w-screen h-screen z-[-5] duration-500`}>
          <img
            src={fetchedBackgroundUrl}
            style={{
              filter: `blur(${bgBlurValue}) brightness(${bgBrightnessValue})`,
            }}
            className="object-cover w-full h-full"
            alt=""
            draggable="false"
          />
        </aside>
      ) : (
        <div className="fixed w-screen h-screen z-[-5]" style={{ backgroundColor: `rgba(${backgroundColor}, ${bgBrightnessValue})` }}></div>
      )}
      <div className={`transition flex items-center justify-center min-h-screen mx-4 ${Minecraftia.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <div
          ref={(el) => {
            if (el && cardTilt) {
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
              el.vanillaTilt.destroy();
            }
          }}
          className={`relative flex w-full max-w-[45em] flex-col items-center space-y-2 p-6 border-[rgb(${accentColor})] shadow-lg ${cardBlur}`}
          style={{
            borderWidth,
            borderColor: `rgb(${accentColor})`,
            borderRadius,
            backgroundColor: `rgba(${primaryColor}, ${cardOpacity})`,
            boxShadow: cardGlow
              ? `0px 0px 10px 4px ${accentColor ? `rgba(${accentColor},1)` : "rgba(239,68,68,1)"}`
              : "",
          }}
        >
          <div className="relative flex flex-col items-center">
            {pfpDecoration ? (
              <>
                <img
                  src={`/static/assets/decorations/${decorationValue}.png`} // Dynamic decoration image
                  className="w-40 h-auto z-10"
                  alt={`${userData?.username}'s decoration`}
                  draggable="false"
                />
                <img
                  src={`${fetchedAvatarUrl}?v=${userData?.pfp_vers}`}
                  className={`absolute bottom-[18px] rounded-full w-32 h-32 object-cover border-[3px] mt-[-2rem]`}
                  alt={`${userData?.username}'s profile`}
                  draggable="false"
                  style={{ borderColor: `rgb(${accentColor})` }}
                />
              </>
            ) : (
              <img
                src={`${fetchedAvatarUrl}?v=${userData?.pfp_vers}`}
                className={`w-32 h-32 object-cover border-[3px] rounded-full`}
                alt={`${userData?.username}'s profile`}
                draggable="false"
                style={{ borderColor: `rgb(${accentColor})` }}
              />
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
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
            <h1
              className="text-3xl font-bold text-center"
              style={{
                backgroundImage: usernameFx ? `url('/static/assets/textFx/${usernameFxColor}sparkle.gif')` : "none",
              }}
            >
              <p style={{ color: `rgb(${textColor})` }}>{displayName}</p>
            </h1>
          </div>

          {/* user description */}
          <div className=''>
            {typingDesc ? (
              <TypeAnimation
                sequence={[description]}
                wrapper='p'
                speed={25}
                repeat={0}
                style={{ color: `rgb(${textColor})` }}
              />
            ) : (
              <p style={{ color: `rgb(${textColor})` }}>{description}</p>
            )}
          </div>

          {/* user socials */}
          <div className="flex">
            {socials.length > 0 ? (
              <span className="flex items-center space-x-2 h-full">
                {socials.map((social, index) => (
                  <Tooltip key={social.id || index} content={
                    <div className='font-bold text-sm bg-black py-1 px-2 rounded-md'>{social.platform}</div>
                  } closeDelay={100} offset={0}>
                    <a href={`${social.platform_link}${social.platform_value}`} target="_blank" rel="noopener noreferrer">
                      <div className={`border border-2 border-[rgb(${accentColor})] px-[8px] py-[10px] ${fullRoundedSocials ? 'rounded-full' : 'rounded-lg'}`}>
                        <i
                          className={`fab fa-${social.platform} fa-2xl`}
                          style={{ filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 3.5px)' }}
                        ></i>
                      </div>
                    </a>
                  </Tooltip>
                ))}
              </span>
            ) : (
              <div className='hidden'></div>
            )}
          </div>

          <p className="text-center">Joined on: {new Date(userData?.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </>
  );
}