'use client';

import { useEffect, useState, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { useUserData } from './util/userDataLogic';
import { useFetchAvatar } from './util/fetchAvatar';
import { useFetchBackground } from './util/fetchBackground';
import { useFetchBanner } from './util/fetchBanner';
import { useFetchAudio } from './util/fetchAudio';
import localFont from "next/font/local";
import { useFetchConfig } from './util/fetchConfig';
import { configConsts } from './util/configConsts';
import { useFetchGeneralConfig } from './util/fetchGeneralConfig';
import { generalConfigConsts } from './util/generalConfigConsts';
import { useFetchBadges } from './util/fetchBadges';
import { useFetchSocials } from './util/fetchSocials';
import { useFetchDiscordInv } from './util/fetchDiscordInv';
import DiscordServerInfo from './util/discordServerInfo';
import { fetchServerInfo } from './util/fetchServerInfo';
import { useFetchCursor } from './util/fetchCursor';
import { useFetchCustomLinks } from './util/fetchCustomLinks';
import { useFetchMediaEmbeds } from './util/fetchMediaEmbeds';
import { Tooltip } from "@nextui-org/tooltip";
import { TypeAnimation } from 'react-type-animation';
import { profile } from 'console';
import Head from 'next/head';
import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';
import H5AudioPlayer from 'react-h5-audio-player';
import { useSupabase } from '@/app/components/utils/SupabaseProvider';

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

  // meta / test in prod
  const PageMeta = () => (
    <Head>
      <meta property="og:title" content={`@${displayName }`} />
      <meta property="og:description" content={description || `@${displayName}'s profile`} />
      <meta name="theme-color" content={`rgb(${embedColor})`} />
    </Head>
  );

  const tiltRef = useRef<HTMLDivElement | null>(null);

  const { userData, loading: userLoading, error } = useUserData();
  const { fetchedAvatarUrl, isAvatarLoading: avatarLoading } = useFetchAvatar();
  const { fetchedBannerUrl, isBannerLoading: bannerLoading } = useFetchBanner();
  const { fetchedCursorUrl, isCursorLoading: cursorLoading } = useFetchCursor();
  const { fetchedBackgroundUrl, isBackgroundLoading: backgroundLoading, fileType } = useFetchBackground();
  const { fetchedAudioUrl, isAudioLoading: audioLoading } = useFetchAudio();
  const { config, loading: configLoading, error: configError } = useFetchConfig(userData?.uid);
  const { generalConfig, loading: generalConfigLoading, error: generalConfigError } = useFetchGeneralConfig(userData?.uid);
  const { badges, isLoadingBadges } = useFetchBadges();
  const { socials, isLoadingSocials } = useFetchSocials();
  const { discordInv, isLoadingDiscordInv } = useFetchDiscordInv();

  // State for storing the fetched server information
  const [serverInfo, setServerInfo] = useState<{
    name: string;
    memberCount: number;
    onlineCount: number;
    iconUrl: string | null;
  } | null>(null);
  const [isFetchingServerInfo, setIsFetchingServerInfo] = useState(false);

  const audioRef = useRef<H5AudioPlayer | null>(null);

  // Fetch server information once discordInv data is loaded
  useEffect(() => {
    if (!isLoadingDiscordInv && discordInv.length > 0) {
      const discordLink = discordInv[0]?.discord_link; // Assuming discord_link is part of discordInv data
      if (discordLink) {
        setIsFetchingServerInfo(true);
        fetchServerInfo(discordLink)
          .then((info) => {
            setServerInfo(info);
          })
          .catch((error) => console.error("Failed to fetch server info:", error))
          .finally(() => setIsFetchingServerInfo(false));
      }
    }
  }, [isLoadingDiscordInv, discordInv]);

  const { customLinks, isLoadingCustomLinks } = useFetchCustomLinks();
  const { mediaEmbeds, isLoadingMediaEmbeds } = useFetchMediaEmbeds();
  const [openStates, setOpenStates] = useState<boolean[]>(Array(mediaEmbeds.length).fill(false));

  useEffect(() => {
    // Set the initial open states based on media.default_open
    setOpenStates(mediaEmbeds.map((media) => media.default_open || false));
  }, [mediaEmbeds]);

  const toggleOpen = (index: number) => {
    setOpenStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index]; // Toggle the specific item
      return newState;
    });
  };

  const hasCustomLinks = customLinks.length > 0;
  const hasMediaEmbeds = mediaEmbeds.length > 0;
  
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showClickToLoad, setShowClickToLoad] = useState(true);

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
    useBanner,
    useAutoplayFix,
    useBackgroundAudio,
  } = configConsts(config);

  const {
    pageTitle,
    displayName,
    description,
    animatedTitle,
    typingDesc,
    clickText,
    audioTitle,
  } = generalConfigConsts(generalConfig);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .rhap_volume-indicator {
        background: rgb(${primaryColor});
      }

      .rhap_volume-filled {
        background: rgb(${primaryColor});
      }

      .rhap_progress-filled {
        background: rgb(${primaryColor});
      }

      .rhap_progress-indicator {
        background: rgb(${primaryColor});
      }

      .rhap_repeat-button {
        background: rgb(${primaryColor});
      }

      .rhap_main-controls-button {
        color: rgb(${primaryColor});
      }

      .rhap_volume-button {
        color: rgb(${primaryColor});
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [primaryColor]);

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
        (tiltRef.current as any).vanillaTilt?.destroy();
      }
    };
  }, [cardTilt]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const [isAudioReady, setIsAudioReady] = useState(false);

  let audioHasBeenPlayed = false

  const onPlayVolume = () => {
    if (audioRef.current && !isAudioReady && !audioHasBeenPlayed) {
      const audioElement = audioRef.current.audio.current;
      if (audioElement) {
        audioElement.volume = 0.05;
      }
      audioHasBeenPlayed = true;
    }
  };

  const onVolumeChange = () => {
    audioHasBeenPlayed = true;
  };

  const handleClick = () => {
    setShowClickToLoad(false);

    if (videoRef.current) {
      videoRef.current.play();
    }

    if (audioRef.current && !isAudioReady) {
      const audioElement = audioRef.current.audio.current;
      if (audioElement) {
        audioElement.muted = false; // Unmute the audio
        audioElement.volume = 0.05; // Set the volume to 0.05
        audioElement.play().catch((error) => {
          console.error('Audio playback failed:', error);
        });
      }
      setIsAudioReady(true);
    }
  };

  const [title, setTitle] = useState("loading.."); // Initial title

  useEffect(() => {
    // Update the title whenever the audio URL changes
    if (fetchedAudioUrl) {
      setTitle("Sqwore - pixie new year"); // Set title based on current audio
      // later set with a variable allowing users to name their audio
    }
  }, [fetchedAudioUrl]);

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
    max: 3,
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

  const [actualPlatform, setActualPlatform] = useState("unknown");

  // Check if the media embeds contain any Spotify or YouTube links
  useEffect(() => {
    if (!isLoadingMediaEmbeds) {
      const embedPlatform = mediaEmbeds.map((media) => media.value);

      const embedSetSpotify = embedPlatform.some(url => url.includes("spotify"));
      const embedSetYoutube = embedPlatform.some(url => url.includes("youtube") || url.includes("youtu"));

      if (embedSetSpotify) {
        setActualPlatform("spotify");
      } else if (embedSetYoutube) {
        setActualPlatform("youtube");
      } else {
        mediaEmbeds.length = 0;
        console.log("platform not found");
      }
    }
  }, [mediaEmbeds, isLoadingMediaEmbeds]);
  
  // Convert any Spotify link (track or playlist) to use as embed src for the iframe
  const convertSpotifyToEmbedUrl = (url: string) => {
    const spotifyRegex = /^(https?:\/\/)?(www\.)?(open\.spotify\.com)/;
  
    if (spotifyRegex.test(url)) {
      // Check if it's a playlist link
      const playlistMatch = url.match(/playlist\/([^?]+)/);
      if (playlistMatch && playlistMatch[1]) {
        const playlistId = playlistMatch[1];
        return `https://open.spotify.com/embed/playlist/${playlistId}`;
      }
  
      // Check if it's a track link
      const trackMatch = url.match(/track\/([^?]+)/);
      if (trackMatch && trackMatch[1]) {
        const trackId = trackMatch[1];
        return `https://open.spotify.com/embed/track/${trackId}`;
      }
    }
  
    return url;
  };  

  // convert any youtube link to use as embed src for the iframe
  const convertToEmbedUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/;
  
    if (youtubeRegex.test(url)) {
      const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^&]+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    return url; // Return the original URL if it's not a valid YouTube link
  };

  const { session, user } = useSupabase();
  // console.log(session, user);
  // console.log("User ID:", user?.id);

  // hide profile stuff
  const sessionUserId = user?.id;

  const isProfileHidden = userData?.hidden;
  const isOwnerViewing = sessionUserId === userData?.id;

  // console.log("Is visiter the profile owner?", isOwnerViewing)

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

  // handle profile hidden
  if (isProfileHidden && !isOwnerViewing) {
    return (
      <div className={`transition flex flex-col fixed inset-0 flex items-center justify-center bg-black z-50 text-white ${geistSans.variable} ${geistMono.variable}`}>
        <div className="border border-4 border-white/20 bg-[#101013] py-2 px-10 rounded-lg text-center">
          <img className='max-w-64 rounded-lg mt-4 mb-4' src='https://c.tenor.com/qP7idh2tg00AAAAd/tenor.gif' />
          <h2 className="text-2xl font-bold">User not found :(</h2>
        </div>
      </div>
    );
  }

  
  return (
    <>
      <style jsx global>{`
        body {
          font-family: var(--font-${profileFont}) !important;
          font-weight: 500;
          ${fetchedCursorUrl ? `cursor: url(${fetchedCursorUrl}), auto;` : ''}
        }
      `}</style>
      
      {/* Conditional rendering for click-to-load overlay */}
      {showClickToLoad && fetchedBackgroundUrl && useAutoplayFix === true ? (
        <main
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          className="flex flex-col justify-center w-screen h-screen cursor-pointer duration-500 fixed"
          onClick={handleClick}
        >
          <p
            style={{ color: backgroundColor }}
            className="flex flex-col px-4 break-words text-center font-semibold text-3xl"
          >
            {clickText}
          </p>
        </main>
      ) : null}

      {/* Background video layer */}
      {fetchedBackgroundUrl ? (
        <aside className={`fixed w-screen h-screen z-[-5] duration-500`}>
          {fileType?.startsWith('video/') ? (
            <video
              ref={videoRef}
              muted
              loop
              style={{
                filter: `blur(${bgBlurValue}) brightness(${bgBrightnessValue})`,
              }}
              className="object-cover w-full h-full"
              draggable="false"
              // Only set autoPlay if the overlay has been clicked
              autoPlay={!showClickToLoad}
            >
              <source src={fetchedBackgroundUrl} type={fileType} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={fetchedBackgroundUrl}
              style={{
                filter: `blur(${bgBlurValue}) brightness(${bgBrightnessValue})`,
              }}
              className="object-cover w-full h-full"
              draggable="false"
              alt=""
            />
          )}
        </aside>
      ) : (
        <div
          className="fixed w-screen h-screen z-[-5]"
          style={{ backgroundColor: `rgba(${backgroundColor}, ${bgBrightnessValue})` }}
        ></div>
      )}
      <div id='userCard' className={`animate-delay-150 animate-fade-down animate-duration-[400ms] animate-ease-linear animate-normal transition flex items-center justify-center min-h-screen mx-4 ${showClickToLoad && useAutoplayFix === true ? 'hidden' : 'block'} ${Minecraftia.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <div
          ref={(el) => {
            if (el && cardTilt) {
              VanillaTilt.init(el, {
                max: 2,
                speed: 2000,
                glare: false,
                reverse: true,
                transition: true,
                easing: "cubic-bezier(.03,.98,.52,.99)",
                reset: true,
              });
            } else if (el && !cardTilt && (el as any).vanillaTilt) {
              (el as any).vanillaTilt.destroy();
            }
          }}
          className={`pb-6 relative flex w-full max-w-[45em] flex-col items-center space-y-2 p-6 border-[rgb(${accentColor})] shadow-lg ${cardBlur}`}
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

          {/* display this message when owner visiting and profile is hidden to notify user their profile is hidden/disabled */}
          {isProfileHidden && isOwnerViewing && (
            <div className='absolute top-[-5.5em] left-1/2 transform -translate-x-1/2 max-w-[45em] w-full'>
              <div className="p-4"
              style={{
                borderWidth,
                borderColor: `rgb(${accentColor})`,
                borderRadius,
                backgroundColor: `rgba(${primaryColor}, ${cardOpacity})`,
                boxShadow: cardGlow
                  ? `0px 0px 10px 1px ${accentColor ? `rgba(${accentColor},1)` : "rgba(239,68,68,1)"}`
                  : "",
              }}>
                <h2 className="text-xl font-bold">Your profile is currently hidden. Only you can see this message.</h2>
              </div>
            </div>
          )}

            {useBanner === true ? (
              <>
                <div className='relative -mx-6 -mt-6 mb-[4.3em]'
                style={{
                  borderBottom: `${borderWidth} solid rgb(${accentColor})`,
                  boxShadow: cardGlow
                    ? `0px 0px 10px 4px ${accentColor ? `rgba(${accentColor},1)` : "rgba(239,68,68,1)"}`
                    : "",
                }}>
                  <img
                  src={`${fetchedBannerUrl}`}
                  className='w-[1000px] h-40 object-cover object-center'
                  style={{
                    borderTopRightRadius: `${borderRadius}`,
                    borderTopLeftRadius: `${borderRadius}`,
                  }}
                  />
                </div>
                <div className="my-[-3.2rem] translate-y-[3.4rem] absolute flex items-center justify-center">
                  <div className="relative flex flex-col items-center">
                  {pfpDecoration ? (
                    <>
                      <img
                        src={`/static/assets/decorations/${decorationValue}.png`} // Dynamic decoration image
                        className="w-40 h-auto z-10"
                        alt={`${userData?.username}'s decoration`}
                        draggable="false"
                        loading='lazy'
                      />
                      <img
                        src={`${fetchedAvatarUrl}?v=${userData?.pfp_vers}`}
                        className={`absolute bottom-[18px] rounded-full w-32 h-32 object-cover border-[3px] mt-[-2rem]`}
                        alt={`${userData?.username}'s profile`}
                        draggable="false"
                        style={{ borderColor: `rgb(${accentColor})`,
                          boxShadow: cardGlow
                          ? `0px 0px 10px 4px ${accentColor ? `rgba(${accentColor},1)` : "rgba(239,68,68,1)"}`
                          : "",
                        }}
                      />
                    </>
                    ) : (
                      <img
                        src={`${fetchedAvatarUrl}?v=${userData?.pfp_vers}`}
                        className={`w-32 h-32 object-cover border-[3px] rounded-full`}
                        alt={`${userData?.username}'s profile`}
                        draggable="false"
                        style={{ borderColor: `rgb(${accentColor})`,
                          boxShadow: cardGlow
                          ? `0px 0px 10px 4px ${accentColor ? `rgba(${accentColor},1)` : "rgba(239,68,68,1)"}`
                          : "",
                        }}
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="relative flex flex-col items-center">
                {pfpDecoration ? (
                  <>
                    <img
                      src={`/static/assets/decorations/${decorationValue}.png`} // Dynamic decoration image
                      className="w-40 h-auto z-10"
                      alt={`${userData?.username}'s decoration`}
                      draggable="false"
                      loading='lazy'
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
            )}

          <div className="flex flex-col items-center justify-center">
            {showBadges && (
              <span className="flex items-center space-x-2 h-full">
                {badges.map((badge, index) => (
                  <Tooltip key={badge.id || index} content={
                    <div className='font-bold text-sm bg-black rounded-lg p-1'>{badge.badge}</div>
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
            {typingDesc && !showClickToLoad? (
              <TypeAnimation
                sequence={[
                  description,  // Type the description
                  5000,         // Wait for 1 second (1000ms)
                  '',           // Erase everything
                  1000,         // Wait for another second
                  description,  // Retype the description
                ]}
                wrapper="p"
                speed={25}
                repeat={999}
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
                {socials
                  .slice() // Create a shallow copy to avoid mutating the original array
                  .sort((a, b) => a.platform.localeCompare(b.platform)) // Sort alphabetically by platform
                  .map((social, index) => (
                    <Tooltip
                      key={social.id || index}
                      content={
                        <div className="font-bold text-sm bg-black py-1 px-2 rounded-md">
                          {social.platform}
                        </div>
                      }
                      closeDelay={100}
                      offset={0}
                    >
                      <a
                        href={`${social.platform_link}${social.platform_value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div
                          className={`border border-2 border-[rgb(${accentColor})] px-[8px] py-[10px] ${
                            fullRoundedSocials ? 'rounded-full' : 'rounded-lg'
                          }`}
                        >
                          <i
                            className={`fab fa-${social.platform} fa-2xl`}
                            style={{
                              filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 1px)',
                            }}
                          ></i>
                        </div>
                      </a>
                    </Tooltip>
                  ))}
              </span>
            ) : (
              <div className="hidden"></div>
            )}
          </div>
          
          {/* Check if either customLinks or mediaEmbeds exist */}
          {(customLinks.length > 0 || mediaEmbeds.length > 0) && (
            <hr
              className="border-b border-2 border-white w-full rounded-lg"
              style={{
                borderColor: `rgb(${accentColor})`,
                marginTop: '1rem',
                marginBottom: '1rem',
              }}
            />
          )}

            {/* Custom Links Section */}
            {customLinks.length > 0 && (
              <div className="w-full grid grid-cols-2 gap-2 items-center">
                {customLinks.map((link, index) => (
                  <a
                    key={link.id}
                    href={link.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-center w-full ${customLinks.length % 2 !== 0 && index === customLinks.length - 1 ? 'col-span-2' : ''}`}
                  >
                    <div
                      className="customlink-card hover:brightness-[200%] border-[3px] flex border p-4 w-full gap-4 items-center transition-all duration-300 hover:bg-opacity-90"
                      style={{
                        borderColor: `rgb(${accentColor})`,
                        borderRadius,
                        backgroundColor: `rgba(${secondaryColor}, ${cardOpacity})`,
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <i
                          className={`fas ${link.icon} fa-xl`}
                          style={{
                            color: `rgb(${accentColor})`,
                            lineHeight: '1',
                            fontSize: '1.5rem',
                          }}
                        />
                      </div>
                      <div className="text-start w-full">
                        <p className="font-bold" style={{ color: `rgb(${textColor})` }}>{link.title}</p>
                        <p className="font-normal text-gray-300 text-sm">{link.value}</p>
                      </div>
                      <div className="customlink-arrow flex items-center justify-end transition-transform duration-300 transform">
                        <i className={`fas fa-arrow-right fa-xl`} />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Media Embeds Section */}
            <div className="w-full">
              {mediaEmbeds.length > 0 && (
                mediaEmbeds.map((media, index) => {
                  const embedUrl = convertToEmbedUrl(media.value);
                  const embedUrlSpotify = convertSpotifyToEmbedUrl(media.value);
                  return (
                    <div key={index} className="w-full">
                      <div
                        onClick={() => toggleOpen(index)}
                        className="cursor-pointer flex flex-col justify-center border border-[3px] p-2 w-full gap-2 items-center transition-all duration-300"
                        style={{
                          borderColor: `rgb(${accentColor})`,
                          borderRadius,
                          backgroundColor: `rgba(${secondaryColor}, ${cardOpacity})`,
                        }}
                      >
                        <p className="text-center" style={{ color: `rgb(${textColor})` }}>{media.title}</p>
                        {openStates[index] && (
                          <div className="flex flex-col">
                            {actualPlatform === "spotify" && (
                              <iframe style={{ borderRadius: borderRadius, marginTop: '0', marginBottom: '8px' }}
                                src={`${embedUrlSpotify}`}
                                width={560} height={175} frameBorder="0" allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"
                              />
                            )}
                            {actualPlatform === "youtube" && (
                              <iframe
                                width="560"
                                height="315"
                                src={`${embedUrl}`}
                                style={{ borderRadius: borderRadius, marginTop: '0', marginBottom: '8px' }}
                                title="Media player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                className="mt-4"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {/* Discord Server Display */}
            {discordInv.length > 0 && discordInv[0]?.discord_link && (
              <div
                className="flex border border-[3px] p-4 w-full transition-all duration-300"
                style={{
                  borderColor: `rgb(${accentColor})`,
                  borderRadius,
                  backgroundColor: `rgba(${secondaryColor}, ${cardOpacity})`,
                }}
              >
                <DiscordServerInfo />
              </div>
            )}
            {/* User Audio Controls & Display */}
            {fetchedAudioUrl && (
              <div className="w-full rounded-xl border border-[3px] p-2 w-full gap-2 items-center transition-all duration-300"
              style={{
                borderColor: `rgb(${accentColor})`,
                borderRadius,
                backgroundColor: `rgba(${secondaryColor}, ${cardOpacity})`,
              }}>
                <h3 className='text-center text-lg mt-2 mb-[-8px]'>{audioTitle}</h3>
                <AudioPlayer
                  ref={audioRef}
                  src={fetchedAudioUrl}
                  onPlay={onPlayVolume}
                  onVolumeChange={onVolumeChange}
                  loop
                />
              </div>
            )}
          </div>
      </div>
    </>
  );
}