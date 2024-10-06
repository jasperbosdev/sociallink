import { useEffect, useState } from "react";
import { supabase } from "../../../supabase"; // Adjust the import based on your directory structure
import { useUserData } from "./userDataLogic";

export const useFetchBackground = () => {
    const { userData } = useUserData(); // Get user data from the custom hook
    const [fetchedBackgroundUrl, setFetchedBackgroundUrl] = useState<string | null>(null);
    const [isBackgroundLoading, setIsBackgroundLoading] = useState(true);

    // Function to fetch the Background from Supabase
    const fetchBackground = async (username: string, bgVers: number) => {
        const fileName = `${username}-bg?v=${bgVers}`; // Add bg_vers to URL query
        const publicUrl = `https://eineipicfkkhevxbsxii.supabase.co/storage/v1/object/public/backgrounds/${fileName}`;

        try {
            const response = await fetch(publicUrl);
            if (!response.ok) {
                throw new Error("File not found");
            }
            setFetchedBackgroundUrl(publicUrl); // Set URL with bg_vers
            // console.log("Fetched Background URL:", publicUrl);
        } catch (error) {
            console.error("Error fetching Background:", error);
            setFetchedBackgroundUrl("");
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
    };

    return { fetchedBackgroundUrl, isBackgroundLoading, updateBackgroundImmediately };
};
