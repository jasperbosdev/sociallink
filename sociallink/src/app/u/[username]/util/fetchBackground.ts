import { useEffect, useState } from "react";
import { supabase } from "../../../supabase"; // Adjust the import based on your directory structure
import { useUserData } from "./userDataLogic";

export const useFetchBackground = () => {
  const { userData } = useUserData(); // Get user data from the custom hook
  const [fetchedBackgroundUrl, setFetchedBackgroundUrl] = useState<string | null>(null);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(true);
  const [fileType, setFileType] = useState<string | null>(null); // State to store the file type

  // Function to fetch the Background from Supabase
  const fetchBackground = async (username: string, bgVers: number) => {
    const fileName = `${username}-bg?v=${bgVers}`; // Add bg_vers to URL query
    const publicUrl = `https://eineipicfkkhevxbsxii.supabase.co/storage/v1/object/public/backgrounds/${fileName}`;
    
    try {
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Error("File not found");
      }

      // Get the content type from the response
      const contentType = response.headers.get("Content-Type");
      if (contentType) {
        setFileType(contentType); // Set the file type
      }

      setFetchedBackgroundUrl(publicUrl); // Set URL with bg_vers
    } catch (error) {
      console.error("Error fetching Background:", error);
      setFetchedBackgroundUrl(null); // Return null if there's an error fetching the background
      setFileType(null); // Reset file type on error
    } finally {
      setIsBackgroundLoading(false);
    }
  };

  // Use the bg_vers value from the userData when fetching the Background
  useEffect(() => {
    if (userData && userData.username && userData.bg_vers !== undefined) {
      setIsBackgroundLoading(true);
      fetchBackground(userData.username, userData.bg_vers);
    }
  }, [userData]);

  // This function can be called after the profile picture is successfully updated
  const updateBackgroundImmediately = (newBackgroundUrl: string) => {
    setFetchedBackgroundUrl(newBackgroundUrl); // Update state immediately with the new Background URL
    // Optionally, reset fileType if you know the new background type
  };

  return { fetchedBackgroundUrl, isBackgroundLoading, fileType, updateBackgroundImmediately };
};