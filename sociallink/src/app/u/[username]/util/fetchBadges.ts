// fetchBadges.ts
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useUserData } from "./userDataLogic";

export const useFetchBadges = () => {
  const { userData } = useUserData(); // Get user data from the custom hook
  const [badges, setBadges] = useState<any[]>([]); // State to store fetched badges
  const [isLoadingBadges, setIsLoadingBadges] = useState(true);

  // Function to fetch badges from the Supabase database
  const fetchBadges = async (uid: number) => {
    try {
    // console.log("Fetching badges for user ID:", uid); // Debugging log

      const { data, error } = await supabase
        .from("badges") // The badges table
        .select("*") // Select all relevant columns
        .eq("uid", uid); // Filter by the current user's uid

      if (error) {
        throw new Error(error.message);
      }

    // console.log("Fetched badge data:", data); // Debugging log to see the fetched data
      setBadges(data || []); // Set the badges data or empty array if no data
    } catch (error) {
      console.error("Error fetching badges:", error);
      setBadges([]); // Empty array in case of an error
    } finally {
      setIsLoadingBadges(false); // Stop loading state
    }
  };

  // Effect to fetch badges only once when userData is available
  useEffect(() => {
    if (userData?.uid) {
      fetchBadges(userData.uid);
    }
  }, [userData]); // Dependency on userData to trigger fetching when available

  return { badges, isLoadingBadges };
};