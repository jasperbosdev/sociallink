// pages/u/[username].tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import from next/router
import { supabase } from '../../src/app/supabase'; // Adjust the path if needed

export default function UserProfile() {
  const router = useRouter();
  const username = router.query.username; // Get the dynamic username from the query
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (username) {
        setLoading(true); // Start loading when fetching data
        const { data, error } = await supabase
          .from('users') // Ensure this matches your table name
          .select('*')
          .eq('username', username)
          .single();

        if (error) {
          setError('User not found');
          setUserData(null); // Reset userData on error
        } else {
          setUserData(data);
        }
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchUserData();
  }, [username]);

  // Show loading indicator if data is being fetched
  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  // Check if userData is available before accessing its properties
  if (!userData) return <div>User data not available</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{userData.username}'s Profile</h1>
      <p>Joined on: {new Date(userData.created_at).toLocaleDateString()}</p>
      {userData.profile_picture && (
        <img src={userData.profile_picture} alt={`${userData.username}'s profile`} />
      )}
    </div>
  );
}
