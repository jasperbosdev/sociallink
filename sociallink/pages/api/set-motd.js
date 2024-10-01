import { supabase } from '../../src/app/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.error('Method not allowed');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('Unauthorized: No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  console.log('Token:', token);

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    console.error('Unauthorized: Invalid token', userError);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  const { data: userRole, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleError || !userRole) {
    console.error('Failed to fetch user role', roleError);
    return res.status(500).json({ error: 'Failed to fetch user role' });
  }

  if (userRole.role !== 'admin') {
    console.error('Forbidden: Not an admin');
    return res.status(403).json({ error: 'Forbidden: Not an admin' });
  }

  // Check if the MOTD exists
  const { data: existingMOTD, error: fetchError } = await supabase
    .from('motd')
    .select('id')
    .eq('id', 1);

  if (fetchError) {
    console.error('Failed to check for existing MOTD', fetchError);
    return res.status(500).json({ error: 'Failed to check for existing MOTD' });
  }

  // If no existing MOTD, create a new one; otherwise, update it
  if (existingMOTD.length === 0) {
    // Insert a new MOTD
    const { error: insertError } = await supabase
      .from('motd')
      .insert([{ id: 1, message: req.body.motd, created_at: new Date() }]);

    if (insertError) {
      console.error('Failed to insert MOTD', insertError);
      return res.status(500).json({ error: 'Failed to insert MOTD' });
    }
  } else {
    // Update the existing MOTD
    const { error: updateError } = await supabase
      .from('motd')
      .update({ message: req.body.motd })
      .eq('id', 1);

    if (updateError) {
      console.error('Failed to update MOTD', updateError);
      return res.status(500).json({ error: 'Failed to update MOTD' });
    }
  }

  console.log('MOTD updated successfully');
  return res.status(200).json({ message: 'MOTD updated successfully' });
}