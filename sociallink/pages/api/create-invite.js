// pages/api/create-invite.js
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  // Generate a new invite token
  const token = nanoid(10);

  // Insert invite into Supabase
  const { data, error } = await supabase
    .from('invites')
    .insert([{ email, token }]);

  if (error) {
    console.error('Error creating invite:', error);
    return res.status(500).json({ message: 'Error creating invite' });
  }

  // Return the invite token
  res.status(200).json({ token });
}