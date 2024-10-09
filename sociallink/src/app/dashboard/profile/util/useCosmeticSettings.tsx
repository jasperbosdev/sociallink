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
  const [cardGlow, setCardGlow] = useState(false);
  const [fullRoundedSocials, setFullRoundedSocials] = useState(false);
  const [usernameFx, useUsernameFx] = useState(false);
  const [pfpDecoration, usePfpDecoration] = useState(false);
  const [decorationValue, setDecorationValue] = useState('');
  const [cardTilt, setCardTilt] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // For showing save status

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
        setCardOpacity(existingSettings.card_opacity || 0);
        setCardBlur(existingSettings.card_blur || 0);
        setCardGlow(existingSettings.card_glow || false);
        setBackgroundBlur(existingSettings.background_blur || 0);
        setBackgroundBrightness(existingSettings.background_brightness || 0);
        setShowViews(existingSettings.show_views || false);
        setShowBadges(existingSettings.show_badges || false);
        setFullRoundedSocials(existingSettings.full_rounded_socials || false);
        useUsernameFx(existingSettings.username_fx || false);
        usePfpDecoration(existingSettings.pfp_decoration || false);
        setDecorationValue(existingSettings.decoration_value || '');
        setCardTilt(existingSettings.card_tilt || false);
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
  
    const uid = publicUserData.uid; // uid from public.users (int4)
  
    const { data: existingEntry, error: fetchError } = await supabase
      .from("profileCosmetics")
      .select("id")
      .eq("uid", uid)
      .single();
  
    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing entry:", fetchError.message);
      setSaveStatus("Error saving changes");
      return;
    }
  
    let success = false;
  
    if (existingEntry) {
      const { error: updateError } = await supabase
        .from("profileCosmetics")
        .update({
          border_width: borderWidth,
          border_radius: borderRadius,
          card_opacity: cardOpacity,
          card_blur: cardBlur,
          card_glow: cardGlow,
          background_brightness: backgroundBrightness,
          background_blur: backgroundBlur,
          username_fx: usernameFx,
          pfp_decoration: pfpDecoration,
          decoration_value: decorationValue,
          card_tilt: cardTilt,
        })
        .eq("id", existingEntry.id);
  
      if (updateError) {
        console.error("Error updating config:", updateError.message);
        setSaveStatus("Error saving changes");
      } else {
        success = true;
      }
    } else {
      const { error: insertError } = await supabase
        .from("profileCosmetics")
        .insert({
          id: id,
          uid: uid,
          border_width: borderWidth,
          border_radius: borderRadius,
          card_opacity: cardOpacity,
          card_blur: cardBlur,
          card_glow: cardGlow,
          background_brightness: backgroundBrightness,
          background_blur: backgroundBlur,
          username_fx: usernameFx,
          pfp_decoration: pfpDecoration,
          decoration_value: decorationValue,
          card_tilt: cardTilt,
        });
  
      if (insertError) {
        console.error("Error inserting config:", insertError.message);
        setSaveStatus("Error saving changes");
      } else {
        success = true;
      }
    }
  
    if (success) {
      setSaveStatus("Saved changes");
      setTimeout(() => setSaveStatus(""), 3000); // Clear after 3 seconds
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
        <div className="text-white">{cardOpacity}</div>
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
          step="0.25" 
        />
        <div className="text-white">{borderRadius}</div>
      </div>

      <div>
        <label className="text-white">Background Blur</label>
        <input
          type="range"
          min="0"
          max="25"
          step={1}
          value={backgroundBlur}
          onChange={(e) => setBackgroundBlur(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-white">{backgroundBlur}</div>
      </div>

      <div>
        <label className="text-white">Background Brightness</label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={backgroundBrightness}
          onChange={(e) => setBackgroundBrightness(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-white">{backgroundBrightness}</div>
      </div>

      {/* Toggles */}
      <div className="flex items-center space-x-2">
        <label className="text-white">Show Views</label>
        <div
          className={`${
            showViews ? "bg-blue-500" : "bg-gray-500"
          } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
          onClick={() => setShowViews(!showViews)}
        >
          <div
            className={`${
              showViews ? "translate-x-6" : "translate-x-0"
            } w-5 h-5 bg-white rounded-full transform transition`}
          ></div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-white">Show Badges</label>
        <div
          className={`${
            showBadges ? "bg-blue-500" : "bg-gray-500"
          } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
          onClick={() => setShowBadges(!showBadges)}
        >
          <div
            className={`${
              showBadges ? "translate-x-6" : "translate-x-0"
            } w-5 h-5 bg-white rounded-full transform transition`}
          ></div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-white">Card Glow</label>
        <div
          className={`${
            cardGlow ? "bg-blue-500" : "bg-gray-500"
          } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
          onClick={() => setCardGlow(!cardGlow)}
        >
          <div
            className={`${
              cardGlow ? "translate-x-6" : "translate-x-0"
            } w-5 h-5 bg-white rounded-full transform transition`}
          ></div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-white">Full Rounded Socials</label>
        <div
          className={`${
            fullRoundedSocials ? "bg-blue-500" : "bg-gray-500"
          } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
          onClick={() => setFullRoundedSocials(!fullRoundedSocials)}
        >
          <div
            className={`${
              fullRoundedSocials ? "translate-x-6" : "translate-x-0"
            } w-5 h-5 bg-white rounded-full transform transition`}
          ></div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-white">Username Effect</label>
        <div
          className={`${
            usernameFx ? "bg-blue-500" : "bg-gray-500"
          } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
          onClick={() => useUsernameFx(!usernameFx)}
        >
          <div
            className={`${
              usernameFx ? "translate-x-6" : "translate-x-0"
            } w-5 h-5 bg-white rounded-full transform transition`}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <label className="text-white">Tilt Effect</label>
        <div
          className={`${
            cardTilt ? "bg-blue-500" : "bg-gray-500"
          } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
          onClick={() => setCardTilt(!cardTilt)}
        >
          <div
            className={`${
              cardTilt ? "translate-x-6" : "translate-x-0"
            } w-5 h-5 bg-white rounded-full transform transition`}
          ></div>
        </div>
      </div>

      <div className="flex items-center flex-wrap">
        <label className="text-white mr-2">Avatar Decoration</label>
        <div
          className={`${
            pfpDecoration ? "bg-blue-500" : "bg-gray-500"
          } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
          onClick={() => usePfpDecoration(!pfpDecoration)}
        >
          <div
            className={`${
              pfpDecoration ? "translate-x-6" : "translate-x-0"
            } w-5 h-5 bg-white rounded-full transform transition`}
          ></div>
        </div>
        {pfpDecoration && (
          <div className="w-full mt-2">
            <label className="text-white">Select Option</label>
            <select
              className="w-full p-2 mt-2 bg-[#101013] text-white rounded border-[3px] border-white/20"
              value={decorationValue}
              onChange={(e) => setDecorationValue(e.target.value)}
            >
              <option value="catears">Cat Ears</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2 h-fit">
        <label className="text-white">Cursor Effect</label>
        <div
          className={`${
            '' ? "bg-blue-500" : "bg-gray-500"
          } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
          onClick={() => ''}
        >
          <div
            className={`${
              '' ? "translate-x-6" : "translate-x-0"
            } w-5 h-5 bg-white rounded-full transform transition`}
          ></div>
        </div>
      </div>

      {/* Save button */}
      <div className="col-span-2">
        <button
          className="border border-[3px] border-white/60 text-white font-bold py-2 px-4 rounded-lg"
          onClick={uploadConfig}
        >
          Save Cosmetic Settings
        </button>
        {saveStatus && (
          <p className="text-green-400 mt-2 text-sm">{saveStatus}</p>
        )}
      </div>
    </div>
  );
}