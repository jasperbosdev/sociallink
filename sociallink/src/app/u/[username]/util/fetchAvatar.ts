import { useEffect, useState } from "react";
import { supabase } from "../../../supabase"; // Adjust the import based on your directory structure
import { useUserData } from "./userDataLogic";

export const useFetchAvatar = () => {
  const { userData } = useUserData(); // Get user data from the custom hook
  const [fetchedAvatarUrl, setFetchedAvatarUrl] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);

  // Function to fetch the avatar from Supabase
  const fetchAvatar = async (username: string, pfpVers: number) => {
    const fileName = `${username}-pfp?v=${pfpVers}`; // Add pfp_vers to URL query
    const publicUrl = `https://eineipicfkkhevxbsxii.supabase.co/storage/v1/object/public/avatars/${fileName}`;

    try {
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Error("File not found");
      }
      setFetchedAvatarUrl(publicUrl); // Set URL with pfp_vers
    } catch (error) {
      console.error("Error fetching avatar:", error);
      setFetchedAvatarUrl(
        "https://i.pinimg.com/736x/19/a0/37/19a037177b02fd2a8f1de4b671fff286.jpg"
      );
    } finally {
      setIsAvatarLoading(false);
    }
  };

  // Use the pfp_vers value from the userData when fetching the avatar
  useEffect(() => {
    if (userData && userData.username && userData.pfp_vers !== undefined) {
      setIsAvatarLoading(true);
      fetchAvatar(userData.username, userData.pfp_vers);
    }
  }, [userData]);

  // This function can be called after the profile picture is successfully updated
  const updateAvatarImmediately = (newAvatarUrl: string) => {
    setFetchedAvatarUrl(newAvatarUrl); // Update state immediately with the new avatar URL
  };

  return { fetchedAvatarUrl, isAvatarLoading, updateAvatarImmediately };
};
