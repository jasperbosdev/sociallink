import { useEffect, useState } from "react";
import { supabase } from "../../../supabase"; // Adjust the import based on your directory structure
import { useUserData } from "./userDataLogic";

export const useFetchCursor = () => {
  const { userData } = useUserData(); // Get user data from the custom hook
  const [fetchedCursorUrl, setFetchedCursorUrl] = useState<string | null>(null);
  const [isCursorLoading, setIsCursorLoading] = useState(true);
  const [fetchAttempted, setFetchAttempted] = useState(false); // Track if fetch was attempted

  // Function to fetch the Cursor from Supabase
  const fetchCursor = async (username: string, cursorVers: number) => {
    const fileName = `${username}-cursor?v=${cursorVers}`;
    const publicUrl = `https://eineipicfkkhevxbsxii.supabase.co/storage/v1/object/public/cursors/${fileName}`;

    try {
      const response = await fetch(publicUrl);
      if (!response.ok) {
        if (!fetchAttempted) {
          console.warn("Cursor file not found; using default cursor.");
          setFetchAttempted(true); // Prevent repeated logging
        }
        throw new Error("File not found");
      }
      setFetchedCursorUrl(publicUrl);
    } catch (error) {
      setFetchedCursorUrl(null); // Reset URL if not found
    } finally {
      setIsCursorLoading(false);
    }
  };

  useEffect(() => {
    if (userData && userData.username && userData.cursor_vers !== undefined) {
      setIsCursorLoading(true);
      fetchCursor(userData.username, userData.cursor_vers);
    }
  }, [userData]);

  // This function can be called after the profile picture is successfully updated
  const updateCursorImmediately = (newCursorUrl: string) => {
    setFetchedCursorUrl(newCursorUrl); // Update state immediately with the new Cursor URL
  };

  return { fetchedCursorUrl, isCursorLoading, updateCursorImmediately };
};