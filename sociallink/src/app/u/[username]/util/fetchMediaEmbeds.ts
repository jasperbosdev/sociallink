// fetch user media embeds
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useUserData } from "./userDataLogic";

export const useFetchMediaEmbeds = () => {
  const { userData } = useUserData(); 
  const [mediaEmbeds, setMediaEmbeds] = useState<any[]>([]);
  const [isLoadingMediaEmbeds, setIsLoadingMediaEmbeds] = useState(true);

  const fetchEmbeds = async (uid: number) => {
    try {

      const { data, error } = await supabase
        .from("profileEmbed")
        .select("*")
        .eq("uid", uid);

      if (error) {
        throw new Error(error.message);
      }

      // console.log("Fetched custom link data:", data); 
      setMediaEmbeds(data || []); 
    } catch (error) {
      console.error("Error fetching Socials:", error);
      setMediaEmbeds([]); 
    } finally {
      setIsLoadingMediaEmbeds(false); 
    }
  };

  useEffect(() => {
    if (userData?.uid) {
      fetchEmbeds(userData.uid);
    }
  }, [userData]);

  return { mediaEmbeds, isLoadingMediaEmbeds };
};