import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../src/app/supabase';

// Function to extract the client's IP address
const getClientIp = (req: NextApiRequest) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress;
  return ip;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username } = req.body;  // username from the URL
    const ip = getClientIp(req);  // Get the IP address of the visitor

    if (!username || !ip) {
      return res.status(400).json({ error: 'Username or IP address not provided' });
    }

    // Get the profile ID using the username
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('uid')
      .eq('username', username)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      return res.status(500).json({ error: 'Error fetching user profile' });
    }

    const profileId = userProfile?.uid;

    // Check if this IP has already visited this profile in the last 24 hours
    const { data: existingView, error: selectError } = await supabase
      .from('profile_views')
      .select('*')
      .eq('uid', profileId)
      .eq('ip_address', ip)
      .gte('view_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // 24-hour window

    if (selectError) {
      console.error('Error fetching view data:', selectError);
      return res.status(500).json({ error: 'Error checking view history' });
    }

    if (existingView?.length === 0) {
      // Insert a new view record if the visitor hasn't viewed this profile in the last 24 hours
      const { error: insertError } = await supabase
        .from('profile_views')
        .insert([{ uid: profileId, ip_address: ip }]);
      
      if (insertError) {
        console.error('Error inserting view data:', insertError);
        return res.status(500).json({ error: 'Error tracking view' });
      }

      return res.status(200).json({ message: 'View tracked successfully' });
    }

    return res.status(200).json({ message: 'View already tracked within 24 hours' });

  } catch (error) {
    console.error('Error in trackView handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}