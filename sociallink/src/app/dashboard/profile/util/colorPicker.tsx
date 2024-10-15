import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useUserData } from "./useUserData";
import { supabase } from "../../../supabase";

interface ColorPickerProps {
  onColorChange: (colors: { primary: string; secondary: string; accent: string; text: string; background: string; embed: string; }) => void;
}

// Convert hex to RGB
const hexToRgb = (hex: string): string => {
  const bigint = parseInt(hex.replace(/^#/, ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

// Convert RGB to hex
const rgbToHex = (rgb: string): string => {
  const rgbValues = rgb.split(',').map(value => parseInt(value.trim()));
  const hex = rgbValues.map(value => {
    const hexValue = value.toString(16).padStart(2, '0');
    return hexValue.toUpperCase();
  }).join('');
  return `#${hex}`;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange }) => {
  const { loading, error, userData } = useUserData(); // Fetch user data
  const [isLoadingColors, setIsLoadingColors] = useState(true);
  
  // State for colors, initialized to empty strings or defaults
  const [primaryColor, setPrimaryColor] = useState("255, 255, 255"); // Default RGB value
  const [secondaryColor, setSecondaryColor] = useState("255, 255, 255");
  const [accentColor, setAccentColor] = useState("255, 255, 255");
  const [textColor, setTextColor] = useState("255, 255, 255");
  const [backgroundColor, setBackgroundColor] = useState("255, 255, 255");
  const [embedColor, setEmbedColor] = useState("255, 255, 255");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<"primary" | "secondary" | "accent" | "text" | "background" | "embed" | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchColors = async (uid: number) => {
      try {
        const { data, error } = await supabase
          .from("profileCosmetics")
          .select("primary_color, secondary_color, accent_color, text_color, background_color, embed_color")
          .eq("uid", uid);
  
        if (error) {
          throw new Error(error.message);
        }

        // Check if data is received
        if (data && data.length > 0) {
          const fetchedColors = data[0]; // Get the first item from the data array
          
          // Set colors directly based on fetched colors
          setPrimaryColor(fetchedColors.primary_color || "255, 255, 255");
          setSecondaryColor(fetchedColors.secondary_color || "255, 255, 255");
          setAccentColor(fetchedColors.accent_color || "255, 255, 255");
          setTextColor(fetchedColors.text_color || "255, 255, 255");
          setBackgroundColor(fetchedColors.background_color || "255, 255, 255");
          setEmbedColor(fetchedColors.embed_color || "255, 255, 255");
        }
        
      } catch (error) {
        console.error("Error fetching Colors:", error);
      } finally {
        setIsLoadingColors(false);
      }
    };
  
    if (userData) {
      fetchColors(userData.uid);
    }
  }, [userData]);

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
    const rgbColor = hexToRgb(newColor);
    if (activeColor === "primary") {
      setPrimaryColor(rgbColor);
    } else if (activeColor === "secondary") {
      setSecondaryColor(rgbColor);
    } else if (activeColor === "accent") {
      setAccentColor(rgbColor);
    } else if (activeColor === "text") {
      setTextColor(rgbColor);
    } else if (activeColor === "background") {
      setBackgroundColor(rgbColor);
    } else if (activeColor === "embed") {
      setEmbedColor(rgbColor);
    }

    // Send updated colors as RGB formatted string to the parent component
    onColorChange({
      primary: activeColor === "primary" ? rgbColor : primaryColor,
      secondary: activeColor === "secondary" ? rgbColor : secondaryColor,
      accent: activeColor === "accent" ? rgbColor : accentColor,
      text: activeColor === "text" ? rgbColor : textColor,
      background: activeColor === "background" ? rgbColor : backgroundColor,
      embed: activeColor === "embed" ? rgbColor : embedColor,
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
                colorType === "primary" ? rgbToHex(primaryColor) :
                colorType === "secondary" ? rgbToHex(secondaryColor) :
                colorType === "accent" ? rgbToHex(accentColor) :
                colorType === "text" ? rgbToHex(textColor) :
                colorType === "background" ? rgbToHex(backgroundColor) : rgbToHex(embedColor),
            }}
          ></div>
        </div>
      ))}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-zinc-700 border-4 border-white/20 p-4 rounded-xl" ref={pickerRef}>
            <HexColorPicker
              color={
                activeColor === "primary" ? rgbToHex(primaryColor) :
                activeColor === "secondary" ? rgbToHex(secondaryColor) :
                activeColor === "accent" ? rgbToHex(accentColor) :
                activeColor === "text" ? rgbToHex(textColor) :
                activeColor === "background" ? rgbToHex(backgroundColor) : rgbToHex(embedColor)
              }
              onChange={handleColorChange}
            />
            <p className="text-center text-white mt-3 font-bold">
              Selected Color: {activeColor ? (
              activeColor === "primary" ? rgbToHex(primaryColor) :
              activeColor === "secondary" ? rgbToHex(secondaryColor) :
              activeColor === "accent" ? rgbToHex(accentColor) :
              activeColor === "text" ? rgbToHex(textColor) :
              activeColor === "background" ? rgbToHex(backgroundColor) : rgbToHex(embedColor)
              ).toUpperCase() : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;