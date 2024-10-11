import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

const ColorPicker: React.FC = () => {
  // State for each type of color
  const [primaryColor, setPrimaryColor] = useState<string>("#aabbcc");
  const [secondaryColor, setSecondaryColor] = useState<string>("#bbccdd");
  const [accentColor, setAccentColor] = useState<string>("#ccddee");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState<string>("#000000");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<"primary" | "secondary" | "accent" | "text" | "background" | null>(null);

  const pickerRef = useRef<HTMLDivElement>(null);

  // Toggle Color Picker
  const handleClick = (colorType: "primary" | "secondary" | "accent" | "text" | "background") => {
    setActiveColor(colorType);
    setIsOpen(!isOpen);
  };

  // Close the color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to set color based on active color type
  const handleColorChange = (newColor: string) => {
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
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Primary Color */}
      <div className="flex flex-col">
        <p className="font-bold mb-2">Primary Color</p>
        <div
          onClick={() => handleClick("primary")}
          className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
          style={{ backgroundColor: primaryColor }}
        ></div>
      </div>

      {/* Secondary Color */}
      <div className="flex flex-col">
        <p className="font-bold mb-2">Secondary Color</p>
        <div
          onClick={() => handleClick("secondary")}
          className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
          style={{ backgroundColor: secondaryColor }}
        ></div>
      </div>

      {/* Accent Color */}
      <div className="flex flex-col">
        <p className="font-bold mb-2">Accent Color</p>
        <div
          onClick={() => handleClick("accent")}
          className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
          style={{ backgroundColor: accentColor }}
        ></div>
      </div>

      {/* Text Color */}
      <div className="flex flex-col">
        <p className="font-bold mb-2">Text Color</p>
        <div
          onClick={() => handleClick("text")}
          className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
          style={{ backgroundColor: textColor }}
        ></div>
      </div>

      <div className="flex flex-col">
        <p className="font-bold mb-2">Background Color</p>
        <div
          onClick={() => handleClick("background")}
          className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
          style={{ backgroundColor: backgroundColor }}
        ></div>
      </div>

      {/* Background Color */}
      <div className="flex flex-col">
        <p className="font-bold mb-2">Embed Color</p>
        <div
          onClick={() => handleClick("background")}
          className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
          style={{ backgroundColor: backgroundColor }}
        ></div>
      </div>

      {/* Color Picker Display */}
      {isOpen && (
        <div className="absolute mt-4 bg-black rounded-lg" ref={pickerRef}>
          <HexColorPicker color={
            activeColor === "primary" ? primaryColor :
            activeColor === "secondary" ? secondaryColor :
            activeColor === "accent" ? accentColor :
            activeColor === "text" ? textColor : backgroundColor
          } onChange={handleColorChange} />
          <p className="text-center text-gray-600 py-1 text-white">Selected Color: {activeColor === "primary" ? primaryColor : 
            activeColor === "secondary" ? secondaryColor : 
            activeColor === "accent" ? accentColor : 
            activeColor === "text" ? textColor : backgroundColor
          }</p>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;