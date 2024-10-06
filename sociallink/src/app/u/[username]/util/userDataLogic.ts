// logic to fetch user data from the database and hide footer n navbar
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../supabase'; // Adjust this import based on your directory structure

export const useUserData = () => {
  const params = useParams(); // Use this to extract dynamic parameters
  const username = params?.username as string; // Type 'username' explicitly as string
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const hideNav = () => {
    const nav = document.getElementById('nav');
    if (nav) {
      nav.style.display = 'none';
    }
  };

  const hideFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  };

  useEffect(() => {
    hideFooter();
    hideNav();
    const fetchUserData = async () => {
      if (username) {
        const { data, error } = await supabase
          .from('users') // Make sure this matches your table
          .select('*')
          .eq('username', username)
          .single();

        if (error) {
          setError('User not found');
        } else {
          setUserData(data);
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  return { userData, loading, error };
};