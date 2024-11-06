// fetch user social medias
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useUserData } from "./userDataLogic";

export const useFetchDiscordInv = () => {
  const { userData } = useUserData(); 
  const [discordInv, setDiscordInv] = useState<any[]>([]);
  const [isLoadingDiscordInv, setIsLoadingDiscordInv] = useState(true);

  const fetchSocials = async (uid: number) => {
    try {

      const { data, error } = await supabase
        .from("profileSocial")
        .select("*")
        .eq("uid", uid);

      if (error) {
        throw new Error(error.message);
      }

      // console.log("Fetched discordInv data:", data); 
      setDiscordInv(data || []); 
    } catch (error) {
      console.error("Error fetching Socials:", error);
      setDiscordInv([]); 
    } finally {
      setIsLoadingDiscordInv(false); 
    }
  };

  useEffect(() => {
    if (userData?.uid) {
      fetchSocials(userData.uid);
    }
  }, [userData]);

  return { discordInv, isLoadingDiscordInv };
};