// fetch user social medias
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useUserData } from "./userDataLogic";

export const useFetchSocials = () => {
  const { userData } = useUserData(); 
  const [socials, setSocials] = useState<any[]>([]);
  const [isLoadingSocials, setIsLoadingSocials] = useState(true);

  const fetchSocials = async (uid: number) => {
    try {

      const { data, error } = await supabase
        .from("socials")
        .select("*")
        .eq("uid", uid);

      if (error) {
        throw new Error(error.message);
      }

      console.log("Fetched social data:", data); 
      setSocials(data || []); 
    } catch (error) {
      console.error("Error fetching Socials:", error);
      setSocials([]); 
    } finally {
      setIsLoadingSocials(false); 
    }
  };

  useEffect(() => {
    if (userData?.uid) {
      fetchSocials(userData.uid);
    }
  }, [userData]);

  return { socials, isLoadingSocials };
};