import { supabase } from '../../supabase';  // adjust your import path if needed

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch the current MOTD from the database
    const { data, error } = await supabase.from('motd').select('*').single();
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch MOTD' });
    }
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { message, userId } = req.body;

    // Check if the user is an admin before allowing the MOTD update
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update the MOTD in the database
    const { error } = await supabase
      .from('motd')
      .update({ message })
      .eq('id', 1);  // assuming MOTD is stored in one row with id=1

    if (error) {
      return res.status(500).json({ error: 'Failed to update MOTD' });
    }
    return res.status(200).json({ message: 'MOTD updated successfully' });
  }
}