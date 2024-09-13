// pages/admin/invite.js
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust the path as needed

export default function InvitePage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createInvite = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    const token = Math.random().toString(36).substr(2); // Generate a simple random token

    const { error } = await supabase
      .from('invites')
      .insert([{ email, token, used: false }]);

    if (error) {
      setError('Failed to create invite.');
      return;
    }

    setSuccess('Invite created successfully.');
    setEmail('');
  };

  return (
    <div>
      <h1>Create Invite</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter user email"
      />
      <button onClick={createInvite} disabled={!email}>
        Create Invite
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}