import { useEffect, useState } from 'react';
import { useFetchDiscordInv } from './fetchDiscordInv';
import { fetchServerInfo } from './fetchServerInfo';

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

  return (
    <div className='flex'>
      {serverInfo.iconUrl && (
        <img src={serverInfo.iconUrl} className='rounded-2xl' alt={`${serverInfo.name} Server Icon`} width="90" height="90" />
      )}
      <p><strong>Server Name:</strong> {serverInfo.name}</p>
      <p><strong>Member Count:</strong> {serverInfo.memberCount}</p>
      <p><strong>Online Count:</strong> {serverInfo.onlineCount}</p>
    </div>
  );
}