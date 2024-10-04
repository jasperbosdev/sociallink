// src/hooks/useUserData.ts
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase'; // Adjust the path as necessary

export const useUserData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error('Session Error:', sessionError);
        setError('No session found');
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      try {
        const { data: userResponse, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          setError('Error fetching user data');
        } else {
          setUserData(userResponse);
        }
      } catch (err) {
        console.error('Error during data fetching:', err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { loading, error, userData };
};