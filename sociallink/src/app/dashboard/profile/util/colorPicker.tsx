import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

const ColorPicker: React.FC = () => {
  // State for each type of color
  const [primaryColor, setPrimaryColor] = useState<string>("#aabbcc");
  const [secondaryColor, setSecondaryColor] = useState<string>("#bbccdd");
  const [accentColor, setAccentColor] = useState<string>("#ccddee");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState<string>("#000000");
  const [embedColor, setEmbedColor] = useState<string>("#000000");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<"primary" | "secondary" | "accent" | "text" | "background" | "embed" | null>(null);

  const pickerRef = useRef<HTMLDivElement>(null);

  // Toggle Color Picker
  const handleClick = (colorType: "primary" | "secondary" | "accent" | "text" | "background" | "embed" ) => {
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
    } else if (activeColor === "embed") {
      setEmbedColor(newColor);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 relative">
      {/* Primary Color */}
      <div className="flex flex-col">
      <p className="font-bold mb-2 select-none">Primary Color</p>
      <div
        onClick={() => handleClick("primary")}
        className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
        style={{ backgroundColor: primaryColor }}
      ></div>
      </div>

      {/* Secondary Color */}
      <div className="flex flex-col">
      <p className="font-bold mb-2 select-none">Secondary Color</p>
      <div
        onClick={() => handleClick("secondary")}
        className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
        style={{ backgroundColor: secondaryColor }}
      ></div>
      </div>

      {/* Accent Color */}
      <div className="flex flex-col">
      <p className="font-bold mb-2 select-none">Accent Color</p>
      <div
        onClick={() => handleClick("accent")}
        className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
        style={{ backgroundColor: accentColor }}
      ></div>
      </div>

      {/* Text Color */}
      <div className="flex flex-col">
      <p className="font-bold mb-2 select-none">Text Color</p>
      <div
        onClick={() => handleClick("text")}
        className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
        style={{ backgroundColor: textColor }}
      ></div>
      </div>

      <div className="flex flex-col">
      <p className="font-bold mb-2 select-none">Background Color</p>
      <div
        onClick={() => handleClick("background")}
        className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
        style={{ backgroundColor: backgroundColor }}
      ></div>
      </div>

      {/* embed Color */}
      <div className="flex flex-col">
      <p className="font-bold mb-2 select-none">Embed Color</p>
      <div
        onClick={() => handleClick("embed")}
        className="w-[10em] h-[4em] rounded-xl cursor-pointer shadow-md border border-[3px] border-white/60"
        style={{ backgroundColor: embedColor }}
      ></div>
      </div>

      {/* Color Picker Display */}
      {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-zinc-700 border-4 border-white/20 p-4 rounded-xl" ref={pickerRef}>
        <HexColorPicker color={
          activeColor === "primary" ? primaryColor :
          activeColor === "secondary" ? secondaryColor :
          activeColor === "accent" ? accentColor :
          activeColor === "text" ? textColor : backgroundColor
        } onChange={handleColorChange} />
        <p className="text-center text-white mt-3 font-bold">Selected Color: {activeColor === "primary" ? primaryColor.toUpperCase() : 
          activeColor === "secondary" ? secondaryColor.toUpperCase() : 
          activeColor === "accent" ? accentColor.toUpperCase() : 
          activeColor === "text" ? textColor.toUpperCase() : backgroundColor.toUpperCase()
        }</p>
        </div>
      </div>
      )}
    </div>
  );
};

export default ColorPicker;