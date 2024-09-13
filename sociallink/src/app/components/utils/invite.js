// lib/invite.js
import { supabase } from './supabase';
import { nanoid } from 'nanoid';

export async function createInvite(email) {
  const token = nanoid(10);  // Generate a 10-character invite token

  const { data, error } = await supabase
    .from('invites')
    .insert([{ email, token }]);

  if (error) {
    console.error('Error creating invite:', error);
    throw error;
  }

  return token;
}