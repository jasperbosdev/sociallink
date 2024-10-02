import { supabase } from '../../src/app/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.error('Method not allowed');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('Unauthorized: No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Validate the token and get the user
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    console.error('Unauthorized: Invalid token', userError);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  try {
    // Fetch the user's role and username from the 'users' table
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role, username')  // Assuming you have a 'username' column in your 'users' table
      .eq('id', user.id)
      .single();

    if (roleError || !userData) {
      console.error('Failed to fetch user role or name', roleError);
      return res.status(500).json({ error: 'Failed to fetch user role or name' });
    }

    const isAdmin = userData.role === 'admin';
    const userName = userData.username;  // Username of the user creating the invite

    // Regular users: check how many invites they have already created
    let inviteCount = 0;

    if (!isAdmin) {
      const { data: invites, error: inviteError } = await supabase
        .from('invites')
        .select('id')  // Select only the id of the invite
        .eq('created_by', user.id);  // Now comparing based on user.id (UUID)

      if (inviteError) {
        console.error('Error fetching invites', inviteError);
        return res.status(500).json({ error: 'Error fetching invites' });
      }

      inviteCount = invites.length;  // Count the number of invites created by the user

      if (inviteCount >= 1) {
        return res.status(403).json({ error: 'You have already created an invite' });
      }
    }

    // Generate a random token (invite key)
    const inviteToken = Math.random().toString(36).substr(2, 10).toUpperCase();

    // Insert invite into the database, using the username in 'created_by'
    const { error: insertError } = await supabase.from('invites').insert([
      {
        email: req.body.email,  // Assuming email is passed in the request body
        token: inviteToken,
        used: false,
        created_at: new Date(),
        invite_limit: isAdmin ? null : 1,  // Admin can create unlimited invites, regular users get 1
        created_by: userName,  // Use the username instead of the user id
        invite_id: inviteCount + 1,  // Set invite_id based on how many invites the user has already created
      },
    ]);

    if (insertError) {
      console.error('Error creating invite', insertError);
      return res.status(500).json({ error: 'Error creating invite' });
    }

    return res.status(200).json({ inviteToken });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}