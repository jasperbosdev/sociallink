// fetch user social medias
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useUserData } from "./userDataLogic";

export const useFetchCustomLinks = () => {
  const { userData } = useUserData(); 
  const [customLinks, setCustomLinks] = useState<any[]>([]);
  const [isLoadingCustomLinks, setIsLoadingCustomLinks] = useState(true);

  const fetchSocials = async (uid: number) => {
    try {

      const { data, error } = await supabase
        .from("profileCustom")
        .select("*")
        .eq("uid", uid);

      if (error) {
        throw new Error(error.message);
      }

      // console.log("Fetched custom link data:", data); 
      setCustomLinks(data || []); 
    } catch (error) {
      console.error("Error fetching Socials:", error);
      setCustomLinks([]); 
    } finally {
      setIsLoadingCustomLinks(false); 
    }
  };

  useEffect(() => {
    if (userData?.uid) {
      fetchSocials(userData.uid);
    }
  }, [userData]);

  return { customLinks, isLoadingCustomLinks };
};