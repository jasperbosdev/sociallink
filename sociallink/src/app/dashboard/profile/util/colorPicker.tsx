import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useUserData } from "./useUserData"; // Import your custom hook

interface ColorPickerProps {
  onColorChange: (colors: { primary: string; secondary: string; accent: string; text: string; background: string; embed: string; }) => void;
  initialColors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    embed: string;
  };
}

// Helper function to convert hex to a comma-separated string of RGB values
const hexToRgbString = (hex: string): string => {
  const parsedHex = hex.replace("#", "");
  const bigint = parseInt(parsedHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`; // Return RGB values as a string with no brackets
};

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange, initialColors }) => {
  const { loading, error, userData } = useUserData(); // Fetch user data

  // Default color values
  const defaultColors = {
    primary: "#ffffff",
    secondary: "#ffffff",
    accent: "#ffffff",
    text: "#000000",
    background: "#ffffff",
    embed: "#ffffff",
  };

  // Check if userData and profileCosmetics are available
  // const initialColors = userData?.profileCosmetics || defaultColors; 

  // Initialize color states
  const [primaryColor, setPrimaryColor] = useState(initialColors.primary);
  const [secondaryColor, setSecondaryColor] = useState(initialColors.secondary);
  const [accentColor, setAccentColor] = useState(initialColors.accent);
  const [textColor, setTextColor] = useState(initialColors.text);
  const [backgroundColor, setBackgroundColor] = useState(initialColors.background);
  const [embedColor, setEmbedColor] = useState(initialColors.embed);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<"primary" | "secondary" | "accent" | "text" | "background" | "embed" | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Handle opening and closing the color picker
  const handleClick = (colorType: "primary" | "secondary" | "accent" | "text" | "background" | "embed") => {
    setActiveColor(colorType);
    setIsOpen(!isOpen);
  };

  // Handle clicking outside to close the color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle color changes
  const handleColorChange = (newColor: string) => {
    // Set the selected color based on activeColor
    if (activeColor === "primary") setPrimaryColor(newColor);
    else if (activeColor === "secondary") setSecondaryColor(newColor);
    else if (activeColor === "accent") setAccentColor(newColor);
    else if (activeColor === "text") setTextColor(newColor);
    else if (activeColor === "background") setBackgroundColor(newColor);
    else if (activeColor === "embed") setEmbedColor(newColor);
  
    // Send RGB values as a comma-separated string to the parent component
    onColorChange({
      primary: hexToRgbString(newColor), // Convert new color to RGB string
      secondary: hexToRgbString(secondaryColor),
      accent: hexToRgbString(accentColor),
      text: hexToRgbString(textColor),
      background: hexToRgbString(backgroundColor),
      embed: hexToRgbString(embedColor),
    });
  };


  // Handle loading state
  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  if (error) {
    return <div>Error fetching user data: {error}</div>; // Error message
  }

  return (
    <div className="flex flex-wrap gap-4 relative">
      {["primary", "secondary", "accent", "text", "background", "embed"].map((colorType) => (
        <div className="flex flex-col" key={colorType}>
          <p className="font-bold mb-2 select-none">{`${colorType.charAt(0).toUpperCase() + colorType.slice(1)} Color`}</p>
          <div
            onClick={() => handleClick(colorType as any)}
            className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
            style={{
              backgroundColor:
                colorType === "primary" ? primaryColor :
                colorType === "secondary" ? secondaryColor :
                colorType === "accent" ? accentColor :
                colorType === "text" ? textColor :
                colorType === "background" ? backgroundColor : embedColor,
            }}
          ></div>
        </div>
      ))}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-zinc-700 border-4 border-white/20 p-4 rounded-xl" ref={pickerRef}>
            <HexColorPicker
              color={
                activeColor === "primary" ? primaryColor :
                activeColor === "secondary" ? secondaryColor :
                activeColor === "accent" ? accentColor :
                activeColor === "text" ? textColor :
                activeColor === "background" ? backgroundColor : embedColor
              }
              onChange={handleColorChange}
            />
            <p className="text-center text-white mt-3 font-bold">
              Selected Color: {activeColor ? (
              activeColor === "primary" ? primaryColor :
              activeColor === "secondary" ? secondaryColor :
              activeColor === "accent" ? accentColor :
              activeColor === "text" ? textColor :
              activeColor === "background" ? backgroundColor : embedColor
              ).toUpperCase() : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;