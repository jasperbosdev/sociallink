// components/CosmeticSettings.tsx

import { useState } from "react";

export default function CosmeticSettings() {
  const [isCosmeticSettingsOpen, setCosmeticSettingsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [blur, setBlur] = useState(0);
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

  return (
    <div className="mt-2 grid grid-cols-2 gap-4">
      {/* Sliders */}
      {/* <div>
        <label className="text-white">Card Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-white">{opacity.toFixed(1)}</div>
      </div> */}

      {/* <div>
        <label className="text-white">Card Blur</label>
        <input
          type="range"
          min="0"
          max="10"
          value={blur}
          onChange={(e) => setBlur(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-white">{blur}</div>
      </div> */}

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
          max="10"
          value={borderRadius}
          onChange={(e) => setBorderRadius(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-white">{borderRadius}</div>
      </div>

      {/* <div>
        <label className="text-white">Background Blur</label>
        <input
          type="range"
          min="0"
          max="10"
          value={backgroundBlur}
          onChange={(e) => setBackgroundBlur(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-white">{backgroundBlur}</div>
      </div> */}

      {/* <div>
        <label className="text-white">Background Brightness</label>
        <input
          type="range"
          min="0"
          max="100"
          value={backgroundBrightness}
          onChange={(e) => setBackgroundBrightness(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-white">{backgroundBrightness}</div>
      </div> */}

      {/* Toggles */}
      {/* <div className="flex items-center space-x-2">
        <span className="text-white">Show Views</span>
        <input
          type="checkbox"
          checked={showViews}
          onChange={() => setShowViews(!showViews)}
          className="toggle-input"
        />
      </div> */}

      {/* <div className="flex items-center space-x-2">
        <span className="text-white">Show Badges</span>
        <input
          type="checkbox"
          checked={showBadges}
          onChange={() => setShowBadges(!showBadges)}
          className="toggle-input"
        />
      </div> */}

      <div className="flex items-center space-x-2">
        <span className="text-white">Glow</span>
        <input
          type="checkbox"
          checked={glow}
          onChange={() => setGlow(!glow)}
          className="toggle-input"
        />
      </div>

      {/* <div className="flex items-center space-x-2">
        <span className="text-white">Animations</span>
        <input
          type="checkbox"
          checked={animations}
          onChange={() => setAnimations(!animations)}
          className="toggle-input"
        />
      </div> */}

      <div className="flex items-center space-x-2">
        <span className="text-white">Username Sparkle</span>
        <input
          type="checkbox"
          checked={usernameSparkle}
          onChange={() => setUsernameSparkle(!usernameSparkle)}
          className="toggle-input"
        />
      </div>

      {/* <div className="flex items-center space-x-2">
        <span className="text-white">Avatar Decoration</span>
        <input
          type="checkbox"
          checked={avatarDecoration}
          onChange={() => setAvatarDecoration(!avatarDecoration)}
          className="toggle-input"
        />
      </div> */}

      {/* <div className="flex items-center space-x-2">
        <span className="text-white">Full Rounded Socials</span>
        <input
          type="checkbox"
          checked={fullRoundedSocials}
          onChange={() => setFullRoundedSocials(!fullRoundedSocials)}
          className="toggle-input"
        />
      </div> */}

      {/* <div className="flex items-center space-x-2">
        <span className="text-white">Tilt Effect</span>
        <input
          type="checkbox"
          checked={tiltEffect}
          onChange={() => setTiltEffect(!tiltEffect)}
          className="toggle-input"
        />
      </div> */}

      {/* <div className="flex items-center space-x-2">
        <span className="text-white">Cursor Effect</span>
        <input
          type="checkbox"
          checked={cursorEffect}
          onChange={() => setCursorEffect(!cursorEffect)}
          className="toggle-input"
        />
      </div> */}

      {/* <div className="flex items-center space-x-2">
        <span className="text-white">Theme Colored Icons</span>
        <input
          type="checkbox"
          checked={themeColoredIcons}
          onChange={() => setThemeColoredIcons(!themeColoredIcons)}
          className="toggle-input"
        />
      </div> */}
      <div className="bg-zinc-800 py-[7px] text-white rounded-md my-1 border-[3px] border-white/20 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit">
        Save Changes
      </div>
    </div>
  );
}
