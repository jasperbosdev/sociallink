import { useEffect, useState } from "react";
import { supabase } from "../../../supabase"; // Adjust the import based on your directory structure
import { useUserData } from "./userDataLogic";
import { Warning } from "postcss";

export const useFetchBanner = () => {
  const { userData } = useUserData(); // Get user data from the custom hook
  const [fetchedBannerUrl, setFetchedBannerUrl] = useState<string | null>(null);
  const [isBannerLoading, setIsBannerLoading] = useState(true);

  // Function to fetch the Banner from Supabase
  const fetchBanner = async (username: string, bannerVers: number) => {
    const fileName = `${username}-banner?v=${bannerVers}`; // Add banner_vers to URL query
    const publicUrl = `https://eineipicfkkhevxbsxii.supabase.co/storage/v1/object/public/banners/${fileName}`;

    try {
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Warning("File not found");
      }
      setFetchedBannerUrl(publicUrl); // Set URL with banner_vers
    } catch (error) {
      console.warn("Error fetching Banner:", error);
      setFetchedBannerUrl(
        "https://i.pinimg.com/736x/19/a0/37/19a037177b02fd2a8f1de4b671fff286.jpg"
      );
    } finally {
      setIsBannerLoading(false);
    }
  };

  // Use the banner_vers value from the userData when fetching the Banner
  useEffect(() => {
    if (userData && userData.username && userData.banner_vers !== undefined) {
      setIsBannerLoading(true);
      fetchBanner(userData.username, userData.banner_vers);
    }
  }, [userData]);

  // This function can be called after the profile picture is successfully updated
  const updateBannerImmediately = (newBannerUrl: string) => {
    setFetchedBannerUrl(newBannerUrl); // Update state immediately with the new Banner URL
  };

  return { fetchedBannerUrl, isBannerLoading, updateBannerImmediately };
};
