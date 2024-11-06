import { useEffect, useState } from 'react';
import { useFetchDiscordInv } from './fetchDiscordInv';
import { useUserData } from './userDataLogic';
import { fetchServerInfo } from './fetchServerInfo';
import { useFetchConfig } from './fetchConfig';
import { configConsts } from './configConsts';

interface ServerInfo {
  name: string;
  memberCount: number;
  onlineCount: number;
  iconUrl: string | null;
}

export default function DiscordServerInfo() {
  const { discordInv, isLoadingDiscordInv } = useFetchDiscordInv();
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userData, loading: userLoading, error } = useUserData();
  const { config, loading: configLoading, error: configError } = useFetchConfig(userData?.uid);

  useEffect(() => {
    const loadServerInfo = async () => {
      if (discordInv.length > 0 && discordInv[0].discord_link) {
        const serverData = await fetchServerInfo(discordInv[0].discord_link);
        setServerInfo(serverData); // Only set if fetch was successful
      }
      setIsLoading(false);
    };

    loadServerInfo();
  }, [discordInv]);

  if (isLoading || isLoadingDiscordInv) {
    return <p>Loading server info...</p>; // Loading state
  }

  if (!serverInfo) {
    return <p>Unable to load server information.</p>; // Error or no data
  }

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

  return (
    <div className='flex justify-between w-full'>
      <div className="flex">
        {serverInfo.iconUrl && (
          <img 
            src={serverInfo.iconUrl} 
            className='rounded-2xl mr-2' 
            alt={`${serverInfo.name} Server Icon`} 
            style={{ width: '80px', height: 'auto' }} 
          />
        )}
        <div className="flex-col text-base items-center">
          <p className='font-black text-lg'>{serverInfo.name}</p>
          <div className='flex items-center'>
            <svg height="10" width="10" className='mr-1'>
              <circle cx="5" cy="5" r="5" fill="#32a852" />
            </svg>
            <p className='text-base'>{serverInfo.onlineCount} Online</p>
          </div>
          <div className='flex items-center'>
            <svg height="10" width="10" className='mr-1'>
              <circle cx="5" cy="5" r="5" fill="#808080" />
            </svg>
            <p className='text-base'>{serverInfo.memberCount} Members</p>
          </div>
        </div>
      </div>
      <div className="flex items-center cursor-pointer"
      onClick={() => window.open(discordInv[0].discord_link, '_blank')}>
        <div className='flex discord-join transition-all border border-[2px] p-2 items-center'
        style={{
          borderColor: `rgb(${accentColor})`,
          borderRadius,
          backgroundColor: `rgba(${primaryColor}, ${cardOpacity})`,
        }}>
          <p>Join Server</p>
          <i className="fas fa-arrow-right ml-2 text-lg join-arrow transition-transform duration-300 transform"></i>
        </div>
      </div>
    </div>
  );
};  