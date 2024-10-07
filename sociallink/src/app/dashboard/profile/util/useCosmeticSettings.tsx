import { useEffect, useState } from "react";
import { useUserData } from "./useUserData";
import { supabase } from "../../../supabase";

export default function CosmeticSettings() {
  const [isCosmeticSettingsOpen, setCosmeticSettingsOpen] = useState(false);
  const [cardOpacity, setCardOpacity] = useState(0);
  const [cardBlur, setCardBlur] = useState(0);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderRadius, setBorderRadius] = useState(0);
  const [backgroundBlur, setBackgroundBlur] = useState(0);
  const [backgroundBrightness, setBackgroundBrightness] = useState(0);
  const [showViews, setShowViews] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [glow, setGlow] = useState(false);
  const [animations, setAnimations] = useState(false);
  const [usernameSparkle, setUsernameSparkle] = useState(false);
  const [avatarDecoration, setAvatarDecoration] = useState(false);
  const [fullRoundedSocials, setFullRoundedSocials] = useState(false);
  const [tiltEffect, setTiltEffect] = useState(false);
  const [cursorEffect, setCursorEffect] = useState(false);
  const [themeColoredIcons, setThemeColoredIcons] = useState(false);

  const { loading, error, userData } = useUserData();

  useEffect(() => {
    const fetchCosmeticSettings = async () => {
      if (loading || !userData) {
        return;
      }

      const id = userData.id; // UUID from auth.users

      // Fetch the uid from public.users based on auth.users id
      const { data: publicUserData, error: publicUserError } = await supabase
        .from("users")
        .select("uid")
        .eq("id", id)
        .single();

      if (publicUserError) {
        console.error("Error fetching public user data:", publicUserError.message);
        return;
      }

      const uid = publicUserData.uid; // uid from public.users (int4)

      // Fetch the existing settings for this user
      const { data: existingSettings, error: fetchError } = await supabase
        .from("profileCosmetics")
        .select("*")
        .eq("uid", uid)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching existing settings:", fetchError.message);
        return;
      }

      if (existingSettings) {
        setBorderWidth(existingSettings.border_width || 0);
        setBorderRadius(existingSettings.border_radius || 0);
        // Initialize other state variables here if you have more in your profileCosmetics table
        // For example:
        setCardOpacity(existingSettings.card_opacity || 0);
        setCardBlur(existingSettings.card_blur || 0);
        // setBackgroundBlur(existingSettings.background_blur || 0);
        // setBackgroundBrightness(existingSettings.background_brightness || 0);
        // setShowViews(existingSettings.show_views || false);
        // setShowBadges(existingSettings.show_badges || false);
        // setGlow(existingSettings.glow || false);
        // setAnimations(existingSettings.animations || false);
        // setUsernameSparkle(existingSettings.username_sparkle || false);
        // setAvatarDecoration(existingSettings.avatar_decoration || false);
        // setFullRoundedSocials(existingSettings.full_rounded_socials || false);
        // setTiltEffect(existingSettings.tilt_effect || false);
        // setCursorEffect(existingSettings.cursor_effect || false);
        // setThemeColoredIcons(existingSettings.theme_colored_icons || false);
      }
    };

    fetchCosmeticSettings();
  }, [loading, userData]);

  const uploadConfig = async () => {
    if (loading || !userData) {
      console.error("User data not ready or still loading");
      return;
    }

    const id = userData.id; // UUID from auth.users

    // Fetch the uid from public.users based on auth.users id
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .select("uid")
      .eq("id", id)
      .single();

    if (publicUserError) {
      console.error("Error fetching public user data:", publicUserError.message);
      return;
    }

    const uid = publicUserData.uid; // uid from public.users (int4)

    // Check if there is already an entry in profileCosmetics for this user
    const { data: existingEntry, error: fetchError } = await supabase
      .from("profileCosmetics")
      .select("id")
      .eq("uid", uid)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing entry:", fetchError.message);
      return;
    }

    if (existingEntry) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from("profileCosmetics")
        .update({
          border_width: borderWidth,
          border_radius: borderRadius,
          card_opacity: cardOpacity,
          card_blur: cardBlur,
          // Update other fields here as necessary
        })
        .eq("id", existingEntry.id);

      if (updateError) {
        console.error("Error updating config:", updateError.message);
        return;
      }

      console.log("Config updated successfully");
    } else {
      // Insert new entry
      const { error: insertError } = await supabase
        .from("profileCosmetics")
        .insert({
          id: id, // UUID from auth.users
          uid: uid, // int4 from public.users
          border_width: borderWidth,
          border_radius: borderRadius,
          card_opacity: cardOpacity,
          card_blur: cardBlur,
          // Insert other fields here as necessary
        });

      if (insertError) {
        console.error("Error inserting config:", insertError.message);
        return;
      }

      console.log("Config inserted successfully");
    }
  };

  return (
    <div className="mt-2 grid grid-cols-2 gap-4">
      {/* Sliders */}
      <div>
        <label className="text-white">Card Opacity</label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={cardOpacity}
          onChange={(e) => setCardOpacity(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-white">{cardOpacity.toFixed(1)}</div>
      </div>

      <div>
        <label className="text-white">Card Blur</label>
        <input
          type="range"
          min="0"
          max="25"
          step={1}
          value={cardBlur}
          onChange={(e) => setCardBlur(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-white">{cardBlur}</div>
      </div>

      <div>
        <label className="text-white">Border Width</label>
        <input
          type="range"
          min="0"
          max="5"
          value={borderWidth}
          onChange={(e) => setBorderWidth(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-white">{borderWidth}</div>
      </div>

      <div>
        <label className="text-white">Border Radius</label>
        <input
          type="range"
          min="0"
          max="1.5"
          value={borderRadius}
          onChange={(e) => setBorderRadius(parseFloat(e.target.value))}
          className="w-full"
          step="0.25" // Set the step to allow values of 0.25 increments
        />
        <div className="text-white">{borderRadius}</div>
      </div>

      {/* Other sliders and toggles can be added similarly */}

      <div
        className="bg-zinc-800 py-[7px] text-white rounded-md my-1 border-[3px] border-white/20 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit"
        onClick={uploadConfig}
      >
        Save Changes
      </div>
    </div>
  );
}