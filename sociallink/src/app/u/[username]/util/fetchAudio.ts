import { useEffect, useState } from "react";
import { supabase } from "../../../supabase"; // Adjust the import based on your directory structure
import { useUserData } from "./userDataLogic";

export const useFetchAudio = () => {
  const { userData } = useUserData(); // Get user data from the custom hook
  const [fetchedAudioUrl, setFetchedAudioUrl] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(true);

  // Function to fetch the Audio from Supabase
  const fetchAudio = async (username: string, audioVers: number) => {
    const fileName = `${username}-audio?v=${audioVers}`; // Add audio_vers to URL query
    const publicUrl = `https://eineipicfkkhevxbsxii.supabase.co/storage/v1/object/public/songs/${fileName}`;

    try {
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Error("File not found");
      }
      setFetchedAudioUrl(publicUrl); // Set URL with Audio_vers
    } catch (error) {
      console.error("Error fetching Audio:", error);
      setFetchedAudioUrl(null);
    } finally {
      setIsAudioLoading(false);
    }
  };

  // Use the Audio_vers value from the userData when fetching the Audio
  useEffect(() => {
    if (userData && userData.username && userData.audio_vers !== undefined) {
      setIsAudioLoading(true);
      fetchAudio(userData.username, userData.audio_vers);
    //   console.log("Fetching Audio with Audio_vers:", userData.audio_vers);
    //   console.log("url fetched:", fetchedAudioUrl);
    }
  }, [userData]);

  return { fetchedAudioUrl, isAudioLoading };
};
