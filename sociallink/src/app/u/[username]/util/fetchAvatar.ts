import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase'; // Adjust the import based on your directory structure
import { useUserData } from './userDataLogic';

export const useFetchAvatar = () => {
    const { userData } = useUserData(); // Get user data from the custom hook
    const [fetchedAvatarUrl, setFetchedAvatarUrl] = useState<string | null>(null);
    const [isAvatarLoading, setIsAvatarLoading] = useState(true);

    // Function to fetch the avatar from Supabase
    const fetchAvatar = async (username: string) => {
        const fileName = `${username}-pfp`;
        const publicUrl = `https://eineipicfkkhevxbsxii.supabase.co/storage/v1/object/public/avatars/${fileName}`;

        try {
            const response = await fetch(publicUrl);
            if (!response.ok) {
                throw new Error('File not found');
            }
            setFetchedAvatarUrl(publicUrl); // Set the public URL directly
        } catch (error) {
            console.error("Error fetching avatar:", error);
            setFetchedAvatarUrl("https://i.pinimg.com/736x/19/a0/37/19a037177b02fd2a8f1de4b671fff286.jpg"); // Fallback to default image
        } finally {
            setIsAvatarLoading(false);
        }
    };

    // Fetch the avatar when userData changes
    useEffect(() => {
        if (userData && userData.username) {
            setIsAvatarLoading(true); // Start loading
            fetchAvatar(userData.username);
        }
    }, [userData]);

    // This function can be called after the profile picture is successfully updated
    const updateAvatarImmediately = (newAvatarUrl: string) => {
        setFetchedAvatarUrl(newAvatarUrl); // Update state immediately with the new avatar URL
    };

    return { fetchedAvatarUrl, isAvatarLoading, updateAvatarImmediately };
};
