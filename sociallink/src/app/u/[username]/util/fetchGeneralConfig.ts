// logic to fetch the user's page/card settings
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';

export const useFetchGeneralConfig = (uid: string | null) => { // Accept uid as an argument
    const [generalConfig, setGeneralConfig] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchGeneralConfig = async () => {
            setLoading(true); // Start loading before fetching
            if (uid) {
                const { data, error } = await supabase
                    .from('profileGeneral') // Ensure this matches your table
                    .select('*')
                    .eq('uid', uid)
                    .single();
        
                if (error) {
                    setError('User not found');
                } else {
                    setGeneralConfig(data);
                }
            } else {
                setError('No UID provided');
            }
            setLoading(false); // End loading
        };

        fetchGeneralConfig();
    }, [uid]);
    
    return { generalConfig, loading, error };
}