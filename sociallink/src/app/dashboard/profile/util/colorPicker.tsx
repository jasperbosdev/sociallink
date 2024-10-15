import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useUserData } from "./useUserData";
import { supabase } from "../../../supabase";

interface ColorPickerProps {
  onColorChange: (colors: { primary: string; secondary: string; accent: string; text: string; background: string; embed: string; }) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange }) => {
  const { loading, error, userData } = useUserData(); // Fetch user data
  const [isLoadingColors, setIsLoadingColors] = useState(true);
  
  // State for colors, initialized to empty strings or defaults
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [embedColor, setEmbedColor] = useState("");
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
          
          // Log fetched color data
          // console.log("Fetched color data:", fetchedColors);
          
          // Set colors directly based on fetched colors
          setPrimaryColor(fetchedColors.primary_color);
          setSecondaryColor(fetchedColors.secondary_color);
          setAccentColor(fetchedColors.accent_color);
          setTextColor(fetchedColors.text_color);
          setBackgroundColor(fetchedColors.background_color);
          setEmbedColor(fetchedColors.embed_color);
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
    if (activeColor === "primary") {
      setPrimaryColor(newColor);
    } else if (activeColor === "secondary") {
      setSecondaryColor(newColor);
    } else if (activeColor === "accent") {
      setAccentColor(newColor);
    } else if (activeColor === "text") {
      setTextColor(newColor);
    } else if (activeColor === "background") {
      setBackgroundColor(newColor);
    } else if (activeColor === "embed") {
      setEmbedColor(newColor);
    }

    // Send updated colors as a comma-separated string to the parent component
    onColorChange({
      primary: activeColor === "primary" ? newColor : primaryColor,
      secondary: activeColor === "secondary" ? newColor : secondaryColor,
      accent: activeColor === "accent" ? newColor : accentColor,
      text: activeColor === "text" ? newColor : textColor,
      background: activeColor === "background" ? newColor : backgroundColor,
      embed: activeColor === "embed" ? newColor : embedColor,
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