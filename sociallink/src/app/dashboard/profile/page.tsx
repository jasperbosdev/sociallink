"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import { useUserData } from "./util/useUserData";
import Nav from "../components/nav";
import CosmeticSettings from "./util/useCosmeticSettings";
import GeneralSettings from "./util/useGeneralSettings";
import SocialSettings from "./util/useSocialSettings";
import CustomSettings from "./util/useCustomSettings";
import EmbedSettings from "./util/useEmbedSettings";

export default function Dashboard() {
  const router = useRouter();
  const { loading, error, userData } = useUserData();

  // New state to hold the avatar URL fetched from Supabase
  const [fetchedAvatarUrl, setFetchedAvatarUrl] = useState<string | null>(null);
  const [fetchedBackgroundUrl, setFetchedBackgroundUrl] = useState<string | null>(null);
  const [fetchedBannerUrl, setFetchedBannerUrl] = useState<string | null>(null);
  const [fetchedCursorUrl, setFetchedCursorUrl] = useState<string | null>(null);
  const [fetchedSongUrl, setFetchedSongUrl] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(true);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isCursorLoading, setIsCursorLoading] = useState(true);
  const [isSongLoading, setIsSongLoading] = useState(true);
  const [uploadAvaSuccess, setUploadAvaSuccess] = useState(false);
  const [uploadBgSuccess, setUploadBgSuccess] = useState(false);
  const [uploadCursorSuccess, setUploadCursorSuccess] = useState(false);
  const [uploadSongSuccess, setUploadSongSuccess] = useState(false);
  const [uploadBannerSuccess, setUploadBannerSuccess] = useState(false);
  const [deleteAvaSuccess, setDeleteAvaSuccess] = useState(false);
  const [deleteBannerSuccess, setDeleteBannerSuccess] = useState(false);
  const [deleteBackgroundSuccess, setDeleteBackroundSuccess] = useState(false);
  const [deleteCursorSuccess, setDeleteCursorSuccess] = useState(false);
  const [deleteSongSuccess, setDeleteSongSuccess] = useState(false);
  const [isAvatarEnabled, setIsAvatarEnabled] = useState(false);
  const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(false);
  const [isBannerEnabled, setIsBannerEnabled] = useState(false);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(false);
  const [isCursorEnabled, setIsCursorEnabled] = useState(false);
  const [useAutoplayFix, setUseAutoplayFix] = useState(false);
  const [isBackgroundAudioEnabled, setIsBackgroundAudioEnabled] = useState(false);
  const [profileHidden, setProfileHidden] = useState(false);
  // State for form inputs
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  // State for collapsible sections
  const [isGeneralSettingsOpen, setGeneralSettingsOpen] = useState(false);
  const [isFileSettingsOpen, setFileSettingsOpen] = useState(false);
  const [isCosmeticSettingsOpen, setCosmeticSettingsOpen] = useState(false);
  const [isSocialSettingsOpen, setSocialSettingsOpen] = useState(false);
  const [isCustomSettingsOpen, setCustomSettingsOpen] = useState(false);
  const [isMediaEmbedSettingsOpen, setMediaEmbedSettingsOpen] = useState(false);
  // State for avatar upload
  const [avatar, setAvatar] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [cursor, setCursor] = useState<File | null>(null);
  const [song, setSong] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [cursorPreview, setCursorPreview] = useState<string | null>(null);
  const [songPreview, setSongPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingCursor, setUploadingCursor] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clickAnywhereText, setClickAnywhereText] = useState("");
  const [clickSaveStatus, setClickSaveStatus] = useState("");

  const handleAddClickAnywhere = async () => {
    if (!clickAnywhereText.trim()) {
      alert("Please enter a valid custom text.");
      return;
    }

    try {
      const id = userData.id; // UUID from auth.users
      const { data: publicUserData, error: publicUserError } = await supabase
        .from("users")
        .select("uid")
        .eq("id", id) // Adjust `id` to match your context
        .single();

      if (publicUserError || !publicUserData) {
        console.error("Error fetching public user data:", publicUserError?.message || "No data returned");
        setClickSaveStatus("error");
        return;
      }

      const uid = publicUserData.uid;

      const { error: updateError } = await supabase
        .from("profileGeneral")
        .update({ click_text: clickAnywhereText })
        .eq("uid", uid);

      if (updateError) {
        console.error("Error updating click_text text:", updateError.message);
        setClickSaveStatus("error");
      } else {
        setClickSaveStatus("success");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setClickSaveStatus("error");
    }
  };

  // Reset all settings for the user and delete all user files
  const resetProfile = async () => {
    // Reset all columns to default values
    const { error: updateError } = await supabase
      .from("profileCosmetics")
      .update({
      border_width: 3,
      bg_color: null,
      username_fx: false,
      card_glow: false,
      show_views: false,
      border_radius: 0.5,
      card_opacity: 90,
      card_blur: 0,
      background_blur: 0,
      background_brightness: 100,
      pfp_decoration: false,
      decoration_value: "",
      card_tilt: false,
      show_badges: false,
      rounded_socials: false,
      primary_color: "0,0,0",
      secondary_color: "101013",
      accent_color: "FFFFFF",
      text_color: "FFFFFF",
      background_color: "10,10,13",
      embed_color: "09090B",
      profile_font: "geistSans",
      usernamefx_color: "",
      use_banner: false,
      use_autoplayfix: false,
      use_backgroundaudio: false,
      })
      .eq("uid", userData.uid);

    if (updateError) {
      console.error("Error updating user settings:", updateError);
      return;
    }
    
    const tablesToDeleteFrom = [
      "profileCustom",
      "profileEmbed",
      "profileSocial",
      "profileGeneral",
      "profile_views",
      "socials",
    ];

    for (const table of tablesToDeleteFrom) {
      const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq("uid", userData.uid);

      if (deleteError) {
      console.error(`Error deleting rows from ${table}:`, deleteError);
      }
    }

    const buckets = [
      { bucket: "avatars", fileName: `${userData.username}-pfp` },
      { bucket: "backgrounds", fileName: `${userData.username}-bg` },
      { bucket: "banners", fileName: `${userData.username}-banner` },
      { bucket: "cursors", fileName: `${userData.username}-cursor` },
      { bucket: "songs", fileName: `${userData.username}-audio` },
    ];

    for (const { bucket, fileName } of buckets) {
      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list("", { search: fileName });

      if (listError) {
        console.error(`Error checking for file in ${bucket}:`, listError);
        continue;
      }

      if (files && files.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([fileName]);

        if (deleteError) {
          console.error(`Error deleting file from ${bucket}:`, deleteError);
        } else {
          // console.log(`File ${fileName} deleted from ${bucket}`);
        }
      }
    }

    // Increment version columns
    await incrementVersionColumns();

    alert("Profile reset successfully!");
  };

  const incrementVersionColumns = async () => {
    try {
      // Step 1: Fetch the current values of the version columns
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("pfp_vers, bg_vers, banner_vers, cursor_vers, audio_vers")
        .eq("id", userData.id)
        .single();
  
      if (fetchError || !user) {
        console.error("Error fetching version columns:", fetchError);
        return;
      }
  
      // Step 2: Increment each version column
      const { pfp_vers, bg_vers, banner_vers, cursor_vers, audio_vers } = user;
      const { error: updateError } = await supabase
        .from("users")
        .update({
          pfp_vers: pfp_vers + 1,
          bg_vers: bg_vers + 1,
          banner_vers: banner_vers + 1,
          cursor_vers: cursor_vers + 1,
          audio_vers: audio_vers + 1,
        })
        .eq("id", userData.id);
  
      if (updateError) {
        console.error("Error updating version columns:", updateError);
      } else {
        console.log("Version columns successfully incremented.");
      }
    } catch (error) {
      console.error("Unexpected error incrementing version columns:", error);
    }
  };

  // Manage bio functions
  const hideProfile = async () => {
    const { data: user, error } = await supabase
      .from("users")
      .select("hidden")
      .eq("id", userData.id)
      .single();

    if (error) {
      console.error("Error fetching user hidden status:", error);
      return;
    }

    const newHiddenStatus = !user.hidden;

    const { error: updateError } = await supabase
      .from("users")
      .update({ hidden: newHiddenStatus })
      .eq("id", userData.id);

    if (updateError) {
      console.error("Error updating user hidden status:", updateError);
    } else {
      console.log("User hidden status updated successfully!");
    }
  };

  const fetchProfileHiddenStatus = async () => {
    if (!userData) return;

    const { data: user, error } = await supabase
      .from("users")
      .select("hidden")
      .eq("id", userData.id)
      .single();

    if (error) {
      console.error("Error fetching user hidden status:", error);
      return;
    }

    setProfileHidden(user.hidden);
  };

  useEffect(() => {
    if (userData) {
      fetchProfileHiddenStatus();
    }
  }, [userData]);

  const profileState = {
    hidden: userData?.hidden || false,
  };

  // Moved the fetchAvatar function here
  const fetchAvatar = async () => {
    if (userData && userData.username) {
      const fileName = `${userData.username}-pfp`;
  
      try {
        // Check if the avatar file as
        const { data: files, error: listError } = await supabase.storage
          .from("avatars")
          .list("", { search: fileName });
  
        if (listError) {
          console.error("Error checking for avatar file:", listError);
          setIsAvatarLoading(false);
          return;
        }
  
        if (!files || files.length === 0) {
          // console.log("No avatar file found for the user.");
          setIsAvatarLoading(false);
          return;
        }
  
        // Create a signed URL for the avatar
        const { data, error } = await supabase.storage
          .from("avatars")
          .createSignedUrl(fileName, 86400);
  
        if (error) {
          console.error("Error fetching avatar:", error);
          setIsAvatarLoading(false);
          return;
        }
  
        setFetchedAvatarUrl(data.signedUrl);
      } catch (error) {
        console.error("Unexpected error in fetchAvatar:", error);
      } finally {
        setIsAvatarLoading(false);
      }
    }
  };

  const fetchBackground = async () => {
    if (userData && userData.username) {
      const fileName = `${userData.username}-bg`;
  
      try {
        // Check if the file exists in the "backgrounds" bucket
        const { data: files, error: listError } = await supabase.storage
          .from("backgrounds")
          .list("", { search: fileName });
  
        if (listError) {
          console.error("Error checking for background file:", listError);
          setIsBackgroundLoading(false);
          return;
        }
  
        if (!files || files.length === 0) {
          // console.log("No background file found for the user.");
          setIsBackgroundLoading(false);
          return;
        }
  
        // Create a signed URL for the file
        const { data, error } = await supabase.storage
          .from("backgrounds")
          .createSignedUrl(fileName, 86400);
  
        if (error) {
          console.error("Error fetching background:", error);
          setIsBackgroundLoading(false);
          return;
        }
  
        const backgroundUrl = data.signedUrl;
        setFetchedBackgroundUrl(backgroundUrl);
  
        // Fetch the MIME type of the file
        try {
          const response = await fetch(backgroundUrl, { method: "HEAD" });
          const contentType = response.headers.get("Content-Type");
  
          if (contentType?.startsWith("video/")) {
            setFileType("video");
          } else if (contentType?.startsWith("image/")) {
            setFileType("image");
          } else {
            console.warn("Unknown content type:", contentType);
            setFileType(null); // Handle unsupported types if needed
          }
        } catch (headError) {
          console.error("Error fetching MIME type:", headError);
        }
      } catch (error) {
        console.error("Unexpected error in fetchBackground:", error);
      } finally {
        setIsBackgroundLoading(false);
      }
    }
  };

  const fetchBanner = async () => {
    if (userData && userData.username) {
      const fileName = `${userData.username}-banner`;
  
      try {
        // Check if the banner file exists
        const { data: files, error: listError } = await supabase.storage
          .from("banners")
          .list("", { search: fileName });
  
        if (listError) {
          console.error("Error checking for banner file:", listError);
          setIsBannerLoading(false);
          return;
        }
  
        if (!files || files.length === 0) {
          // console.log("No banner file found for the user.");
          setIsBannerLoading(false);
          return;
        }
  
        // Create a signed URL for the banner
        const { data, error } = await supabase.storage
          .from("banners")
          .createSignedUrl(fileName, 86400);
  
        if (error) {
          console.error("Error fetching banner:", error);
          setIsBannerLoading(false);
          return;
        }
  
        setFetchedBannerUrl(data.signedUrl);
      } catch (error) {
        console.error("Unexpected error in fetchBanner:", error);
      } finally {
        setIsBannerLoading(false);
      }
    }
  };

  const fetchCursor = async () => {
    if (userData && userData.username) {
      const fileName = `${userData.username}-cursor`;
  
      try {
        // Check if the cursor file exists
        const { data: files, error: listError } = await supabase.storage
          .from("cursors")
          .list("", { search: fileName });
  
        if (listError) {
          console.error("Error checking for cursor file:", listError);
          setIsCursorLoading(false);
          return;
        }
  
        if (!files || files.length === 0) {
          // console.log("No cursor file found for the user.");
          setIsCursorLoading(false);
          return;
        }
  
        // Create a signed URL for the cursor
        const { data, error } = await supabase.storage
          .from("cursors")
          .createSignedUrl(fileName, 86400);
  
        if (error) {
          console.error("Error fetching cursor:", error);
          setIsCursorLoading(false);
          return;
        }
  
        setFetchedCursorUrl(data.signedUrl);
      } catch (error) {
        console.error("Unexpected error in fetchCursor:", error);
      } finally {
        setIsCursorLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAvatar(); // Fetch avatar when component mounts
    fetchBackground(); // Fetch background when component mounts
    fetchBanner(); // Fetch banner when component mounts
    fetchCursor(); // Fetch cursor when component mounts
    fetchSong(); // Fetch song when component mounts

    return () => {
      if (fetchedAvatarUrl) {
        URL.revokeObjectURL(fetchedAvatarUrl);
      }
      if (fetchedBackgroundUrl) {
        URL.revokeObjectURL(fetchedBackgroundUrl);
      }
      if (fetchedBannerUrl) {
        URL.revokeObjectURL(fetchedBannerUrl);
      }
    };
  }, [userData]); // Dependency on userData to refetch if it changes

  const hideFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.style.display = "none";
    }
  };

  useEffect(() => {
    hideFooter();
    // Set avatar preview if file is selected
    if (avatar) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(avatar);
    } else {
      setAvatarPreview(null);
    }

    if (background) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(background);
    } else {
      setBackgroundPreview(null);
    }
  }, [avatar]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newAvatar = event.target.files[0];
      // console.log("Selected file:", newAvatar); // Log the selected file
      setAvatar(newAvatar); // Set the avatar state

      const reader = new FileReader();
      reader.onloadend = () => {
        // console.log("Avatar preview data URL:", reader.result); // Log the preview URL
        setAvatarPreview(reader.result as string); // Set the avatar preview state
      };
      reader.readAsDataURL(newAvatar); // Read the selected file as data URL
    }
  };

  const handleBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newBackground = event.target.files[0];
      setBackground(newBackground);
  
      // Set the fileType based on the MIME type of the selected file
      const isVideo = newBackground.type.startsWith("video/");
      setFileType(isVideo ? "video" : "image");
  
      // Generate a preview URL for the selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(newBackground);
    }
  };  

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newBanner = event.target.files[0];
      // console.log("Selected file:", newBanner); // Log the selected file
      setBanner(newBanner); // Set the Banner state

      const reader = new FileReader();
      reader.onloadend = () => {
        // console.log("Banner preview data URL:", reader.result); // Log the preview URL
        setBannerPreview(reader.result as string); // Set the Banner preview state
      };
      reader.readAsDataURL(newBanner); // Read the selected file as data URL
    }
  };

  const handleCursorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newCursor = event.target.files[0];
      // console.log("Selected file:", newCursor); // Log the selected file
      setCursor(newCursor); // Set the Cursor state

      const reader = new FileReader();
      reader.onloadend = () => {
        // console.log("Cursor preview data URL:", reader.result); // Log the preview URL
        setCursorPreview(reader.result as string); // Set the Cursor preview state
      };
      reader.readAsDataURL(newCursor); // Read the selected file as data URL
    }
  };

  const handleSongChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newSong = event.target.files[0];
      // console.log("Selected file:", newSong); // Log the selected file
      setSong(newSong); // Set the Song state

      // Set the song preview to the file name instead of reading the file
      setSongPreview(newSong.name);
    }
  };

  const incrementPfpVersion = async () => {
    // Step 1: Fetch the current pfp_vers value
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("pfp_vers")
      .eq("id", userData.id)
      .single();
  
    if (fetchError || !user) {
      console.error("Error fetching pfp_vers:", fetchError);
      return;
    }
  
    const currentPfpVers = user.pfp_vers;
  
    // Step 2: Increment the pfp_vers value
    const { error: updateError } = await supabase
      .from("users")
      .update({ pfp_vers: currentPfpVers + 1 })
      .eq("id", userData.id);
  
    if (updateError) {
      console.error("Error updating pfp_vers:", updateError);
    } else {
      // console.log("pfp_vers successfully incremented.");
    }
  };

  const incrementBgVersion = async () => {
    // Step 1: Fetch the current pfp_vers value
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("bg_vers")
      .eq("id", userData.id)
      .single();
  
    if (fetchError || !user) {
      console.error("Error fetching bg_vers:", fetchError);
      return;
    }
  
    const currentBgVers = user.bg_vers;
  
    // Step 2: Increment the pfp_vers value
    const { error: updateError } = await supabase
      .from("users")
      .update({ bg_vers: currentBgVers + 1 })
      .eq("id", userData.id);
  
    if (updateError) {
      console.error("Error updating Bg_vers:", updateError);
    } else {
      // console.log("Bg_vers successfully incremented.");
    }
  };

  const incrementCursorVersion = async () => {
    // Step 1: Fetch the current pfp_vers value
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("cursor_vers")
      .eq("id", userData.id)
      .single();
  
    if (fetchError || !user) {
      console.error("Error fetching cursor_vers:", fetchError);
      return;
    }
  
    const currentCursorVers = user.cursor_vers;
  
    // Step 2: Increment the pfp_vers value
    const { error: updateError } = await supabase
      .from("users")
      .update({ cursor_vers: currentCursorVers + 1 })
      .eq("id", userData.id);
  
    if (updateError) {
      console.error("Error updating cursor_vers:", updateError);
    } else {
      // console.log("Bg_vers successfully incremented.");
    }
  };

  const incrementSongVersion = async () => {
    // Step 1: Fetch the current pfp_vers value
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("audio_vers")
      .eq("id", userData.id)
      .single();
  
    if (fetchError || !user) {
      console.error("Error fetching audio_vers:", fetchError);
      return;
    }
  
    const currentSongVers = user.audio_vers;
  
    // Step 2: Increment the pfp_vers value
    const { error: updateError } = await supabase
      .from("users")
      .update({ audio_vers: currentSongVers + 1 })
      .eq("id", userData.id);
  
    if (updateError) {
      console.error("Error updating song_vers:", updateError);
    } else {
      // console.log("Bg_vers successfully incremented.");
    }
  };

  const incrementBannerVersion = async () => {
    // Step 1: Fetch the current pfp_vers value
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("banner_vers")
      .eq("id", userData.id)
      .single();
  
    if (fetchError || !user) {
      console.error("Error fetching banner_vers:", fetchError);
      return;
    }
  
    const currentBgVers = user.banner_vers;
  
    // Step 2: Increment the pfp_vers value
    const { error: updateError } = await supabase
      .from("users")
      .update({ banner_vers: currentBgVers + 1 })
      .eq("id", userData.id);
  
    if (updateError) {
      console.error("Error updating banner_vers:", updateError);
    } else {
      // console.log("banner_vers successfully incremented.");
    }
  };

  const uploadAvatar = async () => {
    if (!avatar || !userData) return;

    setUploading(true);
    const { username } = userData;
    const fileName = `${username}-pfp`;

    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      setUploadAvaSuccess(false);
    } else {
      // Increment pfp_vers after successful upload
      await incrementPfpVersion();
      await fetchAvatar(); // Refetch the avatar to update the UI
      setUploadAvaSuccess(true);
    }

    setUploading(false);
    setAvatar(null);
  };

  const uploadBackground = async () => {
    if (!background || !userData) return;

    setUploadingBg(true);
    const { username } = userData;
    const fileName = `${username}-bg`;

    const { data, error: uploadError } = await supabase.storage
      .from("backgrounds")
      .upload(fileName, background, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading Background:", uploadError);
      setUploadBgSuccess(false);
    } else {
      // Increment pfp_vers after successful upload
      await incrementBgVersion();
      await fetchBackground(); // Refetch the Background to update the UI
      setUploadBgSuccess(true);
    }

    setUploadingBg(false);
    setBackground(null);
  };

  const uploadBanner = async () => {
    if (!banner || !userData) return;

    setUploadingBanner(true);
    const { username } = userData;
    const fileName = `${username}-banner`;

    const { data, error: uploadError } = await supabase.storage
      .from("banners")
      .upload(fileName, banner, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading Banner:", uploadError);
      setUploadBannerSuccess(false);
    } else {
      // Increment pfp_vers after successful upload
      await incrementBannerVersion();
      await fetchBanner(); // Refetch the Banner to update the UI
      setUploadBannerSuccess(true);
    }

    setUploadingBanner(false);
    setBanner(null);
  };

  const uploadCursor = async () => {
    if (!cursor || !userData) return;
  
    setUploadingCursor(true);
    const { username } = userData;
    const fileName = `${username}-cursor`;
  
    const { data, error: uploadError } = await supabase.storage
      .from("cursors")
      .upload(fileName, cursor, {
        cacheControl: "3600",
        upsert: true,
      });
  
    if (uploadError) {
      console.error("Error uploading Cursor:", uploadError);
      setUploadCursorSuccess(false);
    } else {
      // Optionally add any post-upload logic here
      setUploadCursorSuccess(true);
    }
  
    setUploadingCursor(false);
    setCursor(null); // Reset cursor file after upload
  };

  const uploadSong = async () => {
    if (!song || !userData) return;
  
    setUploadingAudio(true);
    const { username } = userData;
    const fileName = `${username}-audio`;
  
    const { data, error: uploadError } = await supabase.storage
      .from("songs")
      .upload(fileName, song, {
        cacheControl: "3600",
        upsert: true,
      });
  
    if (uploadError) {
      console.error("Error uploading song:", uploadError);
      setUploadSongSuccess(false);
    } else {
      // Optionally add any post-upload logic here
      setUploadSongSuccess(true);
    }
  
    setUploadingAudio(false);
    setSong(null); // Reset cursor file after upload
  };

  const fetchSong = async () => {
    if (userData && userData.username) {
      const fileName = `${userData.username}-audio`;
  
      try {
        // Check if the song file exists
        const { data: files, error: listError } = await supabase.storage
          .from("songs")
          .list("", { search: fileName });
  
        if (listError) {
          console.error("Error checking for song file:", listError);
          setIsSongLoading(false);
          return;
        }
  
        if (!files || files.length === 0) {
          // console.log("No song file found for the user.");
          setIsSongLoading(false);
          return;
        }
  
        // Create a signed URL for the song
        const { data, error } = await supabase.storage
          .from("songs")
          .createSignedUrl(fileName, 86400);
  
        if (error) {
          console.error("Error fetching song:", error);
          setIsSongLoading(false);
          return;
        }
  
        // Set the signed URL with music note emojis
        setFetchedSongUrl(`🎵 ${fileName} 🎵`);
      } catch (error) {
        console.error("Unexpected error in fetchSong:", error);
      } finally {
        setIsSongLoading(false);
      }
    }
  };

  const deleteAvatar = async () => {
    if (!userData) return;

    setDeleting(true);
    const { username } = userData;
    const fileName = `${username}-pfp`;

    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([fileName]);

    if (deleteError) {
      console.error("Error deleting avatar:", deleteError);
      setDeleteAvaSuccess(false);
    } else {
      await incrementPfpVersion(); // Increment pfp_vers after successful delete
      setFetchedAvatarUrl(null); // Clear the fetched avatar URL
      setDeleteAvaSuccess(true);
    }

    setDeleting(false);
  };

  const deleteBanner = async () => {
    if (!userData) return;

    setDeleting(true);
    const { username } = userData;
    const fileName = `${username}-banner`;

    const { error: deleteError } = await supabase.storage
      .from("banners")
      .remove([fileName]);

    if (deleteError) {
      console.error("Error deleting Banner:", deleteError);
      setDeleteBannerSuccess(false);
    } else {
      await incrementBannerVersion(); // Increment pfp_vers after successful delete
      setFetchedBannerUrl(null); // Clear the fetched Banner URL
      setDeleteBannerSuccess(true);
      setIsBannerEnabled(false);
      const { error } = await supabase
        .from("profileCosmetics")
        .update({ use_banner: false })
        .eq("uid", userData.uid);

      if (error) {
        console.error("Error updating banner state in DB:", error);
      }
    }

    setDeleting(false);
  };

  const deleteBackground = async () => {
    if (!userData) return;

    setDeleting(true);
    const { username } = userData;
    const fileName = `${username}-bg`;

    const { error: deleteError } = await supabase.storage
      .from("backgrounds")
      .remove([fileName]);

    if (deleteError) {
      console.error("Error deleting Backround:", deleteError);
      setDeleteBackroundSuccess(false);
    } else {
      await incrementBgVersion(); // Increment pfp_vers after successful delete
      setFetchedBackgroundUrl(null); // Clear the fetched Backround URL
      setDeleteBackroundSuccess(true);
      const { error } = await supabase
        .from("profileCosmetics")
        .update({ use_autoplayfix: false })
        .eq("uid", userData.uid);

      if (error) {
        console.error("Error updating banner state in DB:", error);
      }
    }

    setDeleting(false);
  };

  const deleteCursor = async () => {
    if (!userData) return;

    setDeleting(true);
    const { username } = userData;
    const fileName = `${username}-cursor`;

    const { error: deleteError } = await supabase.storage
      .from("cursors")
      .remove([fileName]);

    if (deleteError) {
      console.error("Error deleting Cursor:", deleteError);
      setDeleteCursorSuccess(false);
    } else {
      await incrementCursorVersion(); // Increment pfp_vers after successful delete
      setFetchedBackgroundUrl(null); // Clear the fetched Cursor URL
      setDeleteCursorSuccess(true);
    }

    setDeleting(false);
  };

  const deleteSong = async () => {
    if (!userData) return;

    setDeleting(true);
    const { username } = userData;
    const fileName = `${username}-audio`;

    const { error: deleteError } = await supabase.storage
      .from("songs")
      .remove([fileName]);

    if (deleteError) {
      console.error("Error deleting song:", deleteError);
      setDeleteSongSuccess(false);
    } else {
      await incrementSongVersion(); // Increment pfp_vers after successful delete
      setFetchedSongUrl(null); // Clear the fetched Song URL
      setDeleteSongSuccess(true);
    }

    setDeleting(false);
  };

  const [initialBannerState, setInitialBannerState] = useState(false);
  const [bannerHasChanges, setBannerHasChanges] = useState(false);
  const [initialAutoplayState, setInitialAutoplayState] = useState(false);
  const [autoplayHasChanges, setAutoplayHasChanges] = useState(false);
  const [initialBackgroundAudioState, setInitialBackgroundAudioState] = useState(false);
  const [backgroundAudioHasChanges, setBackgroundAudioHasChanges] = useState(false);

  // Fetch initial values from database
  useEffect(() => {
    if (userData) {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('profileCosmetics')
          .select('use_autoplayfix, use_banner, use_backgroundaudio')
          .eq('uid', userData.uid)
          .single();

        if (data) {
          setIsAutoplayEnabled(data.use_autoplayfix);
          setInitialAutoplayState(data.use_autoplayfix);

          setIsBannerEnabled(data.use_banner);
          setInitialBannerState(data.use_banner);

          setIsBackgroundAudioEnabled(data.use_backgroundaudio);
          setInitialBackgroundAudioState(data.use_backgroundaudio);
        }

        if (error) {
          console.error("Error fetching profile cosmetics:", error);
        }
      };

      fetchData();
    }
  }, [userData]);

  // Toggle change handlers
  const handleAutoplayToggleChange = () => {
    const newState = !isAutoplayEnabled;
    setIsAutoplayEnabled(newState);
    setAutoplayHasChanges(newState !== initialAutoplayState);
  };

  const handleBannerToggleChange = () => {
    const newState = !isBannerEnabled;
    setIsBannerEnabled(newState);
    setBannerHasChanges(newState !== initialBannerState);
  };

  const handleBackgroundAudioToggleChange = () => {
    const newState = !isBackgroundAudioEnabled;
    setIsBackgroundAudioEnabled(newState);
    setBackgroundAudioHasChanges(newState !== initialBackgroundAudioState);
  };

  // Save changes function
  const handleSaveChanges = async () => {
    if (!userData) return;

    const updates = {};

    if (autoplayHasChanges) {
      updates.use_autoplayfix = isAutoplayEnabled;
    }
    if (bannerHasChanges) {
      updates.use_banner = isBannerEnabled;
    }
    if (backgroundAudioHasChanges) {
      updates.use_backgroundaudio = isBackgroundAudioEnabled;
    }

    try {
      const { error } = await supabase
        .from('profileCosmetics')
        .update(updates)
        .eq('uid', userData.uid);

      if (error) {
        console.error("Error saving profile cosmetics:", error);
        return;
      }

      console.log("Profile cosmetics updated successfully!");

      // Reset initial states and changes tracking after saving
      setInitialAutoplayState(isAutoplayEnabled);
      setAutoplayHasChanges(false);

      setInitialBannerState(isBannerEnabled);
      setBannerHasChanges(false);

      setInitialBackgroundAudioState(isBackgroundAudioEnabled);
      setBackgroundAudioHasChanges(false);
    } catch (error) {
      console.error("Error saving profile cosmetics:", error);
    }
  };

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState("");

  return (
    <>
      <div className="flex">
        <Nav />
        <div className="flex flex-col justify-center items-center w-full px-4 mt-8">
          <div className="bg-[#101013] rounded-lg w-full relative sm:p-4 p-2 mb-4 max-w-6xl border border-4 rounded-xl border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2 className="text-white font-bold text-xl cursor-pointer flex justify-between items-center">
                    <span className="select-none">
                      <i className="fas fa-user-edit mr-2"></i> Manage Bio
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div
                      className="bg-blue-700 py-[7px] text-white rounded-md my-1 border-[3px] border-blue-400 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit"
                      onClick={() =>
                        window.open("/u/" + `${userData.username}`, "_blank")
                      }
                    >
                      View Profile
                    </div>
                    {/* make this function set the profile hidden */}
                    <div className="select-none bg-red-700 py-[7px] text-white rounded-md my-1 border-[3px] border-red-400 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to (un)hide your profile?")) {
                      await hideProfile();
                      setProfileHidden(!profileHidden);
                      }
                    }}>
                        {profileHidden ? "Show Profile" : "Hide Profile"}
                    </div>
                    {/* make this function reset all the values and delete all files */}
                    <div
                      className="select-none bg-red-700 py-[7px] text-white rounded-md my-1 border-[3px] border-red-400 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit"
                      onClick={() => setShowResetModal(true)}
                    >
                      Reset Profile
                    </div>

                    {showResetModal && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-[#101013] border-4 border-white/20 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
                          <h2 className="text-xl font-bold mb-4">Reset Profile</h2>
                          <p className="mb-4">
                          Are you sure you want to RESET your profile? This will reset all your settings and delete all your files.
                          </p>
                          <p>Please type "Reset my profile" to confirm.</p>
                          <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                          value={resetConfirmation}
                          onChange={(e) => setResetConfirmation(e.target.value)}
                          spellCheck="false"
                          />
                          <div className="flex justify-end items-center">
                            <button
                              className="bg-red-600 shadow-none text-white rounded px-4 py-2"
                              onClick={async () => {
                              if (resetConfirmation === "Reset my profile") {
                              await resetProfile();
                              setShowResetModal(false);
                              }
                              }}
                              disabled={resetConfirmation !== "Reset my profile"}
                            >
                              Confirm
                            </button>
                            <button
                              className="shadow-none bg-gray-500 border-white text-white rounded px-4 py-2 ml-2"
                              onClick={() => setShowResetModal(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() =>
                      setGeneralSettingsOpen(!isGeneralSettingsOpen)
                    }
                  >
                    <span className="select-none">
                      <i className="fas fa-file mr-2"></i>{" "}
                      General Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isGeneralSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isGeneralSettingsOpen && (
                    <GeneralSettings />
                  )}
                </div>

                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() => setFileSettingsOpen(!isFileSettingsOpen)}
                  >
                    <span className="select-none">
                      <i className="fas fa-folder mr-2"></i> File Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isFileSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isFileSettingsOpen && (
                    <div className="flex mt-2 grid grid-cols-2 gap-4 flex-wrap">
                      <div className="flex flex-col">
                        <h3 className="text-white/80 text-lg mb-2 text-base font-bold">
                          Avatar
                        </h3>
                        <div
                          className={`flex flex-col items-center justify-center rounded-lg ${
                            avatarPreview || fetchedAvatarUrl
                              ? ""
                              : "px-10 py-5"
                          } space-y-2 border border-2 border-white/20 bg-white/10 cursor-pointer`}
                          onClick={() =>
                            document.getElementById("avatarUploadInput")?.click()
                          } // The whole box is now clickable
                        >
                          {/* Check if avatarPreview (newly selected file) or fetchedAvatarUrl exists */}
                          {avatarPreview || fetchedAvatarUrl ? (
                            <img
                              src={avatarPreview || fetchedAvatarUrl || ""}
                              alt="Loading avatar..."
                              className="w-full h-28 object-cover"
                            />
                          ) : (
                            <>
                              <i className="fas fa-user-circle text-4xl text-white/50"></i>
                              <p className="text-base text-white/60 font-semibold">
                                Click to upload a file
                              </p>
                            </>
                          )}

                          {/* File input for selecting new avatar */}
                          <input
                            id="avatarUploadInput"
                            type="file"
                            className="hidden"
                            onChange={handleAvatarChange}
                            accept=".png, .jpg, .jpeg, .gif" // Handle avatar file change
                          />
                        </div>
                        
                        {fetchedAvatarUrl && (
                          <>
                            <button
                              className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete the avatar?")) {
                                  deleteAvatar();
                                }
                              }}
                              disabled={deleting}
                            >
                              {deleting ? "Deleting..." : "Delete Avatar"}
                            </button>
                          </>
                        )}

                        {/* Display file name if avatar is selected, outside the box */}
                        {avatar && (
                          <button
                            className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                            onClick={uploadAvatar}
                            disabled={uploading}
                          >
                            {uploading ? "Uploading..." : "Upload Avatar"}
                          </button>
                        )}

                        {/* Conditionally render success message */}
                        {uploadAvaSuccess && (
                          <div className="mt-4 text-green-600">
                            Avatar uploaded successfully!
                          </div>
                        )}

                        <label className="mt-2 flex items-center cursor-pointer">
                          <span className="mr-2 text-white/60 font-semibold">
                            Use Discord Avatar
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isAvatarEnabled}
                              onChange={() =>
                                setIsAvatarEnabled(!isAvatarEnabled)
                              }
                            />
                            <div
                              className={`block w-12 h-6 rounded-full ${
                                isAvatarEnabled ? "bg-green-500" : "bg-gray-300"
                              }`}
                            ></div>
                            <div
                              className={`dot absolute left-0 top-0 w-6 h-6 rounded-full bg-white transition ${
                                isAvatarEnabled ? "translate-x-6" : ""
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>

                      <div className="flex flex-col">
                        <h3 className="text-white/80 text-lg mb-2 text-base font-bold">
                          Background
                        </h3>
                        <div
                          className={`flex flex-col items-center justify-center rounded-lg ${
                            backgroundPreview || fetchedBackgroundUrl ? "" : "px-10 py-5"
                          } space-y-2 border border-2 border-white/20 bg-white/10 cursor-pointer`}
                          onClick={() => document.getElementById("backgroundUploadInput")?.click()}
                        >
                          {/* Check if backgroundPreview (newly selected file) or fetchedBackgroundUrl exists and fileType is ready */}
                            {backgroundPreview || (fetchedBackgroundUrl && fileType) ? (
                            fileType === "video" ? (
                              <video
                              src={backgroundPreview || fetchedBackgroundUrl}
                              className="w-full h-28 object-cover"
                              autoPlay
                              lazy="true"
                              loop
                              muted
                              alt="Loading avatar..."
                              />
                            ) : (
                              <img
                              src={backgroundPreview || fetchedBackgroundUrl}
                              alt="Background preview"
                              className="w-full h-28 object-cover"
                              />
                            )
                            ) : isBackgroundLoading ? (
                            <div className="flex items-center justify-center w-full h-28">
                              <p className="text-base text-white/60 font-semibold">Loading...</p>
                            </div>
                            ) : (
                            <>
                              <i className="fas fa-photo-film text-4xl text-white/50"></i>
                              <p className="text-base text-white/60 font-semibold">Click to upload a file</p>
                            </>
                            )}

                          {/* File input for selecting new background */}
                          <input
                            id="backgroundUploadInput"
                            type="file"
                            className="hidden"
                            onChange={handleBackgroundChange}
                            accept=".png, .jpg, .jpeg, .gif, .mp4" // Handle avatar file change
                          />
                        </div>

                        {fetchedBackgroundUrl && (
                          <>
                            <button
                              className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete the Background?")) {
                                  deleteBackground();
                                }
                              }}
                              disabled={deleting}
                            >
                              {deleting ? "Deleting..." : "Delete Background"}
                            </button>
                          </>
                        )}

                        {/* Display file name if background is selected, outside the box */}
                        {background && (
                          <button
                            className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                            onClick={uploadBackground}
                            disabled={uploadingBg}
                          >
                            {uploadingBg ? "Uploading..." : "Upload Background"}
                          </button>
                        )}

                        {/* Conditionally render success message */}
                        {uploadBgSuccess && (
                          <div className="mt-4 text-green-600">
                            Background uploaded successfully!
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-white/80 text-lg mb-2 text-base font-bold">
                          Banner
                        </h3>
                        <div
                          className={`flex flex-col items-center justify-center rounded-lg ${
                            bannerPreview || fetchedBannerUrl
                              ? ""
                              : "px-10 py-5"
                          } space-y-2 border border-2 border-white/20 bg-white/10 cursor-pointer`}
                          onClick={() =>
                            document
                              .getElementById("bannerUploadInput")
                              ?.click()
                          } // The whole box is now clickable
                        >
                          {/* Check if bannerPreview (newly selected file) or fetchedbannerUrl exists */}
                          {bannerPreview || fetchedBannerUrl ? (
                            <img
                              src={bannerPreview || fetchedBannerUrl || ""}
                              alt="Loading banner..."
                              className="w-full h-28 object-cover"
                            />
                          ) : (
                            <>
                              <i className="fas fa-image text-4xl text-white/50"></i>
                              <p className="text-base text-white/60 font-semibold">
                                Click to upload a file
                              </p>
                            </>
                          )}

                          {/* File input for selecting new banner */}
                          <input
                            id="bannerUploadInput"
                            type="file"
                            className="hidden"
                            onChange={handleBannerChange}
                            accept=".png, .jpg, .jpeg, .gif" // Handle avatar file change
                          />
                        </div>

                        {fetchedBannerUrl && (
                          <>
                            <button
                              className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete the Banner?")) {
                                  deleteBanner();
                                }
                              }}
                              disabled={deleting}
                            >
                              {deleting ? "Deleting..." : "Delete Banner"}
                            </button>
                          </>
                        )}

                        <div>
                          <label className="mt-2 flex items-center cursor-pointer">
                            <span className="mr-2 text-white/60 font-semibold">Enable Banner</span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={isBannerEnabled}
                                onChange={handleBannerToggleChange}
                              />
                              <div
                                className={`block w-12 h-6 rounded-full ${
                                  isBannerEnabled ? "bg-green-500" : "bg-gray-300"
                                }`}
                              ></div>
                              <div
                                className={`dot absolute left-0 top-0 w-6 h-6 rounded-full bg-white transition ${
                                  isBannerEnabled ? "translate-x-6" : ""
                                }`}
                              ></div>
                            </div>
                          </label>
                        </div>

                        {/* Display file name if banner is selected, outside the box */}
                        {banner && (
                          <button
                            className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                            onClick={uploadBanner}
                            disabled={uploadingBanner}
                          >
                            {uploadingBanner ? "Uploading..." : "Upload Banner"}
                          </button>
                        )}

                        {/* Conditionally render success message */}
                        {uploadBannerSuccess && (
                          <div className="mt-4 text-green-600">
                            Banner uploaded successfully!
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-white/80 text-lg mb-2 text-base font-bold">
                          Cursor
                        </h3>
                        <div
                          className={`flex flex-col items-center justify-center rounded-lg ${
                            cursorPreview ? "" : "px-10 py-5"
                          } space-y-2 border border-2 border-white/20 bg-white/10 cursor-pointer`}
                          onClick={() =>
                            document.getElementById("cursorUploadInput")?.click()
                          } // The whole box is now clickable
                        >
                          {/* Display preview if cursorPreview exists */}
                          {cursorPreview || fetchedCursorUrl ? (
                            <img
                              src={cursorPreview || fetchedCursorUrl}
                              alt="Cursor preview"
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <>
                              <i className="fas fa-arrow-pointer text-white/60 text-4xl"></i>
                              <p className="text-base text-white/60 font-semibold">
                                Click to upload a file
                              </p>
                            </>
                          )}

                          {/* File input for selecting new cursor */}
                          <input
                            id="cursorUploadInput"
                            type="file"
                            className="hidden"
                            onChange={handleCursorChange}
                            accept=".png, .jpg, .jpeg, .gif, .cur" // Accept common cursor formats
                          />
                        </div>

                        {fetchedCursorUrl && (
                          <>
                            <button
                              className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete the Cursor?")) {
                                  deleteCursor();
                                }
                              }}
                              disabled={deleting}
                            >
                              {deleting ? "Deleting..." : "Delete Cursor"}
                            </button>
                          </>
                        )}
                        
                        {/* Display file name if cursor is selected, outside the box */}
                        {cursor && (
                          <button
                            className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                            onClick={uploadCursor}
                            disabled={uploadingCursor}
                          >
                            {uploadingCursor ? "Uploading..." : "Upload Cursor"}
                          </button>
                        )}

                        {/* Conditionally render success message */}
                        {uploadCursorSuccess && (
                          <div className="mt-4 text-green-600">
                            Cursor uploaded successfully!
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <h3 className="text-white/80 text-lg text-base font-bold">
                          Songs
                        </h3>
                        <p className="mb-2 text-sm">(song title feature coming soon..)</p>
                        <div
                          className={`flex flex-col items-center justify-center rounded-lg ${
                            songPreview ? "" : "px-10 py-5"
                          } space-y-2 border border-2 border-white/20 bg-white/10 cursor-pointer`}
                          onClick={() =>
                            document.getElementById("songUploadInput")?.click()
                          } // The whole box is now clickable
                        >
                          {/* Display preview if songPreview exists */}
                          {songPreview || fetchedSongUrl ? (
                            <p className="text-center p-1">{ songPreview || fetchedSongUrl }</p>
                          ) : (
                            <>
                              <i className="fas fa-music text-white/60 text-4xl"></i>
                              <p className="text-base text-white/60 font-semibold">
                                Click to upload a file
                              </p>
                            </>
                          )}

                          {/* File input for selecting new song */}
                          <input
                            id="songUploadInput"
                            type="file"
                            className="hidden"
                            onChange={handleSongChange}
                            accept=".mp3"
                          />
                        </div>

                        {fetchedSongUrl && (
                          <>
                            <button
                              className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete the Song?")) {
                                  deleteSong();
                                }
                              }}
                              disabled={deleting}
                            >
                              {deleting ? "Deleting..." : "Delete Song"}
                            </button>
                          </>
                        )}
                        
                        {/* Display file name if cursor is selected, outside the box */}
                        {song && (
                          <button
                            className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                            onClick={uploadSong}
                            disabled={uploadingCursor}
                          >
                            {uploadingCursor ? "Uploading..." : "Upload Song"}
                          </button>
                        )}

                        {/* Conditionally render success message */}
                        {uploadSongSuccess && (
                          <div className="mt-4 text-green-600">
                            Song uploaded successfully!
                          </div>
                        )}
                      </div>
                      <div></div>
                      {/* Autoplay Fix and Background Audio Toggles */}
                        <div className="">
                          <h3 className="text-white/80 text-lg mb-2 text-base font-bold">Miscellaneous</h3>
                                                    
                          {/* Autoplay Fix Toggle */}
                          <div>
                            <label className="mt-2 flex items-center cursor-pointer">
                              <span className="mr-2 text-white/60 font-semibold">Autoplay Fix</span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={isAutoplayEnabled}
                                  onChange={handleAutoplayToggleChange}
                                />
                                <div
                                  className={`block w-12 h-6 rounded-full ${isAutoplayEnabled ? "bg-green-500" : "bg-gray-300"}`}
                                ></div>
                                <div
                                  className={`dot absolute left-0 top-0 w-6 h-6 rounded-full bg-white transition ${isAutoplayEnabled ? "translate-x-6" : ""}`}
                                ></div>
                              </div>
                            </label>
                            {/* if autoplay enabled show input for custom click anywhere text (sanitised) */}
                            {isAutoplayEnabled && (
                              <>
                                <div className="mt-1">
                                  <span className="text-white/60 font-bold text-sm">Custom Text</span>
                                </div>
                                <div className="mt-1">
                                  <input
                                    className="bg-[#101013] border-2 text-white border-white/20 rounded-lg"
                                    placeholder="ᴄʟɪᴄᴋ ᴀɴʏᴡʜᴇʀᴇ"
                                    value={clickAnywhereText}
                                    onChange={(e) => setClickAnywhereText(e.target.value)}
                                  />
                                </div>
                                <div
                                  className="bg-white/10 select-none border border-[3px] border-white/60 p-2 font-bold cursor-pointer rounded-lg hover:scale-[1.05] transition w-fit mt-2"
                                  onClick={handleAddClickAnywhere}
                                >
                                  Save changes
                                </div>
                                {clickSaveStatus === "success" && (
                                  <div className="text-green-500 font-bold mt-2 text-sm">Changes saved successfully!</div>
                                )}
                                {clickSaveStatus === "error" && (
                                  <div className="text-red-500 font-bold mt-2 text-sm">Failed to save changes. Please try again.</div>
                                )}
                              </>
                            )}
                          </div>
                                                    
                          {/* Background Audio Toggle */}
                          <div>
                            <label className="mt-2 flex items-center cursor-pointer">
                              <span className="mr-2 text-white/60 font-semibold">Use Uploaded Audio</span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={isBackgroundAudioEnabled}
                                  onChange={handleBackgroundAudioToggleChange}
                                />
                                <div
                                  className={`block w-12 h-6 rounded-full ${isBackgroundAudioEnabled ? "bg-green-500" : "bg-gray-300"}`}
                                ></div>
                                <div
                                  className={`dot absolute left-0 top-0 w-6 h-6 rounded-full bg-white transition ${isBackgroundAudioEnabled ? "translate-x-6" : ""}`}
                                ></div>
                              </div>
                            </label>
                          </div>
                                                    
                          {/* Save Button */}
                          {(autoplayHasChanges || bannerHasChanges || backgroundAudioHasChanges) && (
                            <button
                              onClick={handleSaveChanges}
                              className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
                            >
                              Save Changes
                            </button>
                          )}
                        </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() =>
                      setCosmeticSettingsOpen(!isCosmeticSettingsOpen)
                    }
                  >
                    <span className="select-none">
                      <i className="fas fa-wand-magic-sparkles mr-2"></i>{" "}
                      Cosmetic Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isCosmeticSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isCosmeticSettingsOpen && (
                    <CosmeticSettings />
                  )}
                </div>

                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() => setSocialSettingsOpen(!isSocialSettingsOpen)}
                  >
                    <span className="select-none">
                      <i className="fas fa-share-alt mr-2"></i> Social Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isSocialSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isSocialSettingsOpen && (
                    <SocialSettings />
                  )}
                </div>

                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() =>
                      setCustomSettingsOpen(!isCustomSettingsOpen)
                    }
                  >
                    <span className="select-none">
                      <i className="fas fa-link mr-2"></i> Custom Link Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isCustomSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isCustomSettingsOpen && (
                    <div className="mt-2">
                      <CustomSettings />
                    </div>
                  )}
                </div>

                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() =>
                      setMediaEmbedSettingsOpen(!isMediaEmbedSettingsOpen)
                    }
                  >
                    <span className="select-none">
                      <i className="fas fa-video mr-2"></i> Media Embed Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isMediaEmbedSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isMediaEmbedSettingsOpen && (
                    <div className="mt-2">
                      <EmbedSettings />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}