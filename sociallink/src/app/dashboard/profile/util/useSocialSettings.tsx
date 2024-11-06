import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../supabase";
import { useUserData } from "./useUserData";

export default function SocialSettings() {
  const [richPresence, setRichPresence] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [existingSocials, setExistingSocials] = useState([]); // State to store existing socials
  const [newPlatform, setNewPlatform] = useState(""); // State for selected platform
  const [newUsername, setNewUsername] = useState(""); // State for input username
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedSocial, setSelectedSocial] = useState(null); // State for selected social to edit
  const [discordLink, setDiscordLink] = useState("");
  const modalRef = useRef(null); // Ref for the modal

  const { loading, error, userData } = useUserData();

  // Fetch social settings
  useEffect(() => {
    const fetchSocialSettings = async () => {
      if (loading || !userData) {
        return;
      }
  
      const id = userData.id;
  
      const { data: publicUserData, error: publicUserError } = await supabase
        .from("users")
        .select("uid")
        .eq("id", id)
        .single();
  
      if (publicUserError) {
        console.error("Error fetching public user data:", publicUserError.message);
        return;
      }
  
      const uid = publicUserData.uid;
  
      const { data: existingSettings, error: fetchError } = await supabase
        .from("socials")
        .select("*")
        .eq("uid", uid);
  
      if (fetchError) {
        console.error("Error fetching existing settings:", fetchError.message);
        return;
      }
  
      if (existingSettings && existingSettings.length > 0) {
        // Sort socials alphabetically by platform name
        const sortedSocials = existingSettings.sort((a, b) => 
          a.platform.localeCompare(b.platform)
        );
  
        setExistingSocials(sortedSocials);
        setRichPresence(existingSettings[0].use_presence); // Assuming use_presence is common across socials
      }
    };
  
    fetchSocialSettings();
  }, [loading, userData]);

  // Close modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const uploadConfig = async () => {
    if (loading || !userData) {
      console.error("User data not ready or still loading");
      return;
    }

    const id = userData.id; // UUID from auth.users

    // Fetch the user's public data
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .select("uid")
      .eq("id", id)
      .single();

    if (publicUserError) {
      console.error("Error fetching public user data:", publicUserError.message);
      setSaveStatus("Error saving changes");
      return;
    }

    const uid = publicUserData.uid;

    // Update use_presence in public.users table
    const { error: updateUserError } = await supabase
      .from("users")
      .update({ use_presence: richPresence }) // Update use_presence
      .eq("uid", uid);

    if (updateUserError) {
      console.error("Error updating user presence:", updateUserError.message);
      setSaveStatus("Error saving changes");
      return;
    }

    // If everything is successful
    setSaveStatus("Saved changes");
    setTimeout(() => setSaveStatus(""), 3000); // Clear the status after 3 seconds
  };

  const handleAddSocial = async () => {
    if (loading || !userData || !newPlatform || !newUsername) {
      console.error("User data not ready, platform, or username not provided");
      return;
    }

    const id = userData.id;

    // Fetch the user's public data
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .select("uid")
      .eq("id", id)
      .single();

    if (publicUserError) {
      console.error("Error fetching public user data:", publicUserError.message);
      setSaveStatus("Error adding social link");
      return;
    }

    const uid = publicUserData.uid;

    // Map platforms to their base URLs
    const platformLinkMapping = {
      youtube: `https://www.youtube.com/`,
      twitch: `https://www.twitch.tv/`,
      kick: `https://www.kick.com/`,
      twitter: `https://twitter.com/`,
      instagram: `https://www.instagram.com/`,
      threads: `https://www.threads.net/`,
      github: `https://github.com/`,
      reddit: `https://www.reddit.com/user/`,
      namemc: `https://namemc.com/profile/`,
      telegram: `https://t.me/`,
      soundcloud: `https://soundcloud.com/`,
      spotify: `https://open.spotify.com/user/`,
      discord: `https://discord.com/users/`, // Assuming user has the Discord user ID
      snapchat: `https://www.snapchat.com/add/`,
      steam: `https://steamcommunity.com/id/`,
      email: `mailto:`,
      tiktok: `https://www.tiktok.com/@`,
      paypal: `https://paypal.me/`,
      cashapp: `https://cash.app/$`,
      bitcoin: `bitcoin:`, // Assuming this is a wallet address
      ethereum: `ethereum:`,
      litecoin: `litecoin:`,
      'battle net': `https://battle.net/`,
      valorant: `https://playvalorant.com/`,
      'osu!': `https://osu.ppy.sh/users/`,
      'last.fm': `https://www.last.fm/user/`,
      myanimelist: `https://myanimelist.net/profile/`,
      deezer: `https://www.deezer.com/user/`,
      pinterest: `https://www.pinterest.com/`,
      xbox: `https://account.xbox.com/en-us/profile/`,
      playstation: `https://psnprofiles.com/`,
      patreon: `https://www.patreon.com/`,
      roblox: `https://www.roblox.com/users/`,
      vk: `https://vk.com/`,
    };

    // Generate platform link
    const platformLink = platformLinkMapping[newPlatform];

    // Insert new social into the socials table, no need to set the id field manually
    const { error: insertError } = await supabase
      .from("socials")
      .insert([
        {
          username: userData.username,
          platform: newPlatform,
          platform_value: newUsername,
          platform_link: platformLink, // Add the platform link
          uid: uid,
          added_on: new Date().toISOString(), // Insert current timestamp
        }
      ]);

    if (insertError) {
      console.error("Error inserting new social:", insertError.message);
      setSaveStatus("Error adding social link");
      return;
    }

    // Refresh the socials list after adding a new entry
    const { data: updatedSocials, error: fetchError } = await supabase
      .from("socials")
      .select("*")
      .eq("uid", uid);

    if (fetchError) {
      console.error("Error fetching updated socials:", fetchError.message);
      setSaveStatus("Error refreshing socials");
      return;
    }

    // Update state with the new socials list and clear input fields
    setExistingSocials(updatedSocials);
    setNewPlatform("");
    setNewUsername("");
    setSaveStatus("Social added successfully");
    setTimeout(() => setSaveStatus(""), 3000); // Clear the status after 3 seconds
  };

  // Function to handle when a social item is clicked to open the modal
  const handleSocialClick = (social) => {
    setSelectedSocial(social);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSocial(null);
  };

  // Function to handle updating the selected social
  const handleUpdateSocial = async () => {
    const { id, platform_value } = selectedSocial;

    const { error } = await supabase
      .from("socials")
      .update({ platform_value })
      .eq("id", id);

    if (error) {
      console.error("Error updating social:", error.message);
    } else {
      // Refresh the socials list after updating
      const { data: updatedSocials, error: fetchError } = await supabase
        .from("socials")
        .select("*")
        .eq("uid", userData.uid);

      if (!fetchError) {
        setExistingSocials(updatedSocials);
      }
      closeModal();
    }
  };

  // Function to handle deleting the selected social
  const handleDeleteSocial = async () => {
    const { id } = selectedSocial;

    const { error } = await supabase
      .from("socials")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting social:", error.message);
    } else {
      // Refresh the socials list after deleting
      const { data: updatedSocials, error: fetchError } = await supabase
        .from("socials")
        .select("*")
        .eq("uid", userData.uid);

      if (!fetchError) {
        setExistingSocials(updatedSocials);
      }
      closeModal();
    }
  };

  // Function to upload Discord link to profileSocial table
  const handleSaveDiscordLink = async () => {
    if (loading || !userData || !discordLink) {
      console.error("User data not ready or Discord link is empty");
      return;
    }

    const id = userData.id;
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .select("uid")
      .eq("id", id)
      .single();

    if (publicUserError) {
      console.error("Error fetching public user data:", publicUserError.message);
      setSaveStatus("Error saving Discord link");
      return;
    }

    const uid = publicUserData.uid;

    // First, check if a record with the given uid already exists
    const { data: existingRecord, error: fetchError } = await supabase
      .from("profileSocial")
      .select("uid")
      .eq("uid", uid)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 means no rows found
      console.error("Error checking for existing Discord link:", fetchError.message);
      setSaveStatus("Error saving Discord link");
      return;
    }

    let saveError;

    if (existingRecord) {
      // If the record exists, update it
      const { error: updateError } = await supabase
        .from("profileSocial")
        .update({
          discord_link: discordLink,
          updated_at: new Date().toISOString() // Use 'updated_at' for updates
        })
        .eq("uid", uid);

      saveError = updateError;
    } else {
      // If the record doesn't exist, insert a new one
      const { error: insertError } = await supabase
        .from("profileSocial")
        .insert({
          uid: uid,
          discord_link: discordLink,
          created_at: new Date().toISOString()
        });

      saveError = insertError;
    }

    if (saveError) {
      console.error("Error saving Discord link:", saveError.message);
      setSaveStatus("Error saving Discord link");
      return;
    }

    setSaveStatus("Discord link saved successfully");
    setTimeout(() => setSaveStatus(""), 3000); // Clear the status after 3 seconds
  };

  const clearDiscord = async () => {
    if (loading || !userData) {
      console.error("User data not ready or still loading");
      return;
    }

    const id = userData.id;
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .select("uid")
      .eq("id", id)
      .single();

    if (publicUserError) {
      console.error("Error fetching public user data:", publicUserError.message);
      setSaveStatus("Error clearing Discord link");
      return;
    }

    const uid = publicUserData.uid;

    const { error: updateError } = await supabase
      .from("profileSocial")
      .update({ discord_link: null })
      .eq("uid", uid);

    if (updateError) {
      console.error("Error clearing Discord link:", updateError.message);
      setSaveStatus("Error clearing Discord link");
      return;
    }

    setSaveStatus("Discord link cleared successfully");
    setTimeout(() => setSaveStatus(""), 3000); // Clear the status after 3 seconds
  };

  return (
    <>
      {/* Add New Social Section */}
      <div className="flex mt-2 gap-2 flex-wrap">
        <div className="mt-2 flex-1">
          <label className="text-white font-bold">Platform</label>
          <select
            className="w-full p-2 mt-2 bg-[#101013] text-white rounded-lg border-[3px] border-white/20"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)} // Set platform value
          >
            <PlatformList />
          </select>
        </div>
        <div className="mt-2 flex-1">
          <label className="text-white font-bold">Username/Value</label>
          <input
            className="w-full p-2 mt-2 bg-[#101013] text-white rounded-lg border-[3px] border-white/20"
            placeholder="leeuwz (username only)"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)} // Set username value
          />
        </div>
      </div>
      <button
        className="border border-[2px] border-white/60 bg-zinc-900 text-white font-bold py-2 px-2 rounded-lg mt-2 text-sm"
        onClick={handleAddSocial} // Add social button functionality
      >
        Add Social
      </button>

      {/* Existing Socials Section */}
      <div className="py-2">
        <h3 className="text-white font-bold mt-2">Existing Socials</h3>
        <p className="text-sm mb-2">(will be displayed in alphabetical order)</p>
        <div className="bg-zinc-900 border border-[3px] border-white/20 rounded-lg p-4">
          {existingSocials.length > 0 && (
            <div className="">
              <ul className="flex gap-2 flex-wrap">
                {existingSocials.map((social) => (
                  <div className="border border-[3px] border-white/40 px-3 py-3 rounded-lg flex-1 text-center min-w-[150px] hover:scale-[1.05] transition cursor-pointer select-none" key={social.id}>
                    <li key={social.id} className="text-white" onClick={() => handleSocialClick(social)}>
                        <i className={`fab fa-${social.platform} fa-2xl mr-2`}></i>
                        <span className="font-bold">{social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}</span>
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modal for editing or deleting a social */}
      {isModalOpen && selectedSocial && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-zinc-900 border border-4 border-white/20 p-8 rounded-lg shadow-lg"
          >
            <h2>Edit {selectedSocial.platform}</h2>
            <input
              className="border bg-zinc-800 border-[3px] border-white/20 rounded-lg p-2 mt-2 text-white"
              type="text"
              value={selectedSocial.platform_value}
              onChange={(e) =>
                setSelectedSocial({
                  ...selectedSocial,
                  platform_value: e.target.value,
                })
              }
            />
            <div className="flex mt-2 gap-2">
                <div className="border border-[3px] border-white/20 p-2 w-full text-center cursor-pointer rounded-lg" onClick={handleUpdateSocial}>Save</div>
                <div
                  className="border border-[3px] border-white/20 p-2 w-full text-center cursor-pointer rounded-lg" onClick={() => {
                    if (window.confirm("Are you sure you want to delete this social?")) {
                      handleDeleteSocial();
                    }
                  }}
                >
                  Delete
                </div>
                <div className="border border-[3px] border-white/20 p-2 w-full text-center cursor-pointer rounded-lg" onClick={closeModal}>Cancel</div>
            </div>
          </div>
        </div>
      )}

      {/* Discord Settings Section */}
      <div className="flex flex-wrap mt-2">
        <div className="mt-2 w-full">
          <label className="text-white font-bold">Discord Invite</label>
          <input
            className="w-full p-2 mt-2 bg-[#101013] text-white rounded-lg border-[3px] border-white/20"
            placeholder="https://discord.gg/komako"
            value={discordLink}
            onChange={(e) => setDiscordLink(e.target.value)} // Update Discord link state
          />
        </div>
        <div className="mt-4 mr-2">
          <button
            className="border border-[2px] border-red-500 bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
            onClick={clearDiscord} // Save Discord link functionality
          >
            Clear Current
          </button>
        </div>
        {/* Save Button for Discord link */}
        <div className="mt-4">
          <button
            className="border border-[2px] border-white/60 bg-zinc-900 text-white font-bold py-2 px-4 rounded-lg"
            onClick={handleSaveDiscordLink} // Save Discord link functionality
          >
            Save Discord Link
          </button>
        </div>
        <div className="flex mt-2">
          <label className="text-white mr-2 font-bold">Discord Presence <span className="text-sm font-normal">(requires discord to be linked)</span></label>
          <div
            className={`${
              richPresence ? "bg-blue-500" : "bg-gray-500"
            } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
            onClick={() => setRichPresence(!richPresence)}
          >
            <div
              className={`${
                richPresence ? "translate-x-6" : "translate-x-0"
              } bg-white w-4 h-4 rounded-full transition`}
            ></div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-4">
        <button
          className="border border-[2px] border-white/60 bg-zinc-900 text-white font-bold py-2 px-4 rounded-lg"
          onClick={uploadConfig}
        >
          Save Social Settings
        </button>
        
      {/* Save status display */}
      {saveStatus && <p className="mt-2 text-green-500">{saveStatus}</p>}
      </div>
    </>
  );
}

// A separate component for platform options
const PlatformList = () => {
const platforms = [
    "youtube",
    "twitch",
    // "kick",
    "twitter",
    "instagram",
    // "threads",
    "github",
    "reddit",
    // "namemc",
    "telegram",
    "soundcloud",
    "spotify",
    // "discord",
    "snapchat",
    "steam",
    "email",
    "tiktok",
    "paypal",
    // "cashapp",
    // "bitcoin",
    "ethereum",
    // "litecoin",
    // "battle net",
    // "valorant",
    // "osu!",
    "last.fm",
    "myanimelist",
    // "deezer",
    "pinterest",
    "xbox",
    "playstation",
    "patreon",
    "roblox",
    "vk",
];

  return (
    <>
      <option value="">Select a platform...</option>
      {platforms.map((platform) => (
        <option key={platform} value={platform}>
          {platform}
        </option>
      ))}
    </>
  );
};