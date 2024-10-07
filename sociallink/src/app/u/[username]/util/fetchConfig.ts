// logic to fetch the user's page/card settings
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';

export const useFetchConfig = (uid: string | null) => { // Accept uid as an argument
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchUserConfig = async () => {
            setLoading(true); // Start loading before fetching
            if (uid) {
                const { data, error } = await supabase
                    .from('profileCosmetics') // Ensure this matches your table
                    .select('*')
                    .eq('uid', uid)
                    .single();
        
                if (error) {
                    setError('User not found');
                } else {
                    setConfig(data);
                }
            } else {
                setError('No UID provided');
            }
            setLoading(false); // End loading
        };

        fetchUserConfig();
    }, [uid]);
    
    return { config, loading, error };
}
