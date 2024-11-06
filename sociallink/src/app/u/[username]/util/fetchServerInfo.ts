import { useFetchDiscordInv } from "./fetchDiscordInv";

export const fetchServerInfo = async (discordInviteLink: string) => {
  // Extract the invite code from the link
  const inviteCode = extractInviteCodeFromLink(discordInviteLink);

  if (!inviteCode) {
    console.error("Invalid Discord invite link. Unable to extract invite code.");
    return null;
  }

  // Discord API URL to fetch server details with member counts
  const discordInviteApiUrl = `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`;

  try {
    const response = await fetch(discordInviteApiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch server info from invite");
    }

    const data = await response.json();
    const { guild, approximate_member_count, approximate_presence_count } = data;

    if (!guild) {
      console.error("No guild information found in invite data.");
      return null;
    }

    const { name, icon, id: serverId } = guild;

    // Construct the icon URL if available
    const iconUrl = icon
      ? `https://cdn.discordapp.com/icons/${serverId}/${icon}.png`
      : null;

    // Return structured server info
    return {
      name,
      memberCount: approximate_member_count,
      onlineCount: approximate_presence_count,
      iconUrl,
    };
  } catch (error) {
    console.error("Error fetching server info:", error);
    return null;
  }
};

// Utility function to extract the invite code from the invite link URL
const extractInviteCodeFromLink = (discordInviteLink: string) => {
  const match = discordInviteLink.match(/discord\.gg\/(?:invite\/)?([\w-]+)/);
  return match ? match[1] : null;
};