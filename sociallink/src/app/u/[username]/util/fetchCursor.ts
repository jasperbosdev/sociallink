import { useEffect, useState } from "react";
import { supabase } from "../../../supabase"; // Adjust the import based on your directory structure
import { useUserData } from "./userDataLogic";

export const useFetchCursor = () => {
  const { userData } = useUserData(); // Get user data from the custom hook
  const [fetchedCursorUrl, setFetchedCursorUrl] = useState<string | null>(null);
  const [isCursorLoading, setIsCursorLoading] = useState(true);

  // Function to fetch the Cursor from Supabase
  const fetchCursor = async (username: string, cursorVers: number) => {
    const fileName = `${username}-cursor?v=${cursorVers}`; // Add cursor_vers to URL query
    const publicUrl = `https://eineipicfkkhevxbsxii.supabase.co/storage/v1/object/public/cursors/${fileName}`;

    try {
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Error("File not found");
      }
      setFetchedCursorUrl(publicUrl); // Set URL with Cursor_vers
    } catch (error) {
      console.error("Error fetching Cursor:", error);
      setFetchedCursorUrl(
        "https://i.pinimg.com/736x/19/a0/37/19a037177b02fd2a8f1de4b671fff286.jpg"
      );
    } finally {
      setIsCursorLoading(false);
    }
  };

  // Use the Cursor_vers value from the userData when fetching the Cursor
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
