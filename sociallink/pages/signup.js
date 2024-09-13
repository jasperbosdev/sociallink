// pages/signup.js
import { useState } from 'react';
import { supabase } from '../src/app/supabase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if the invite token is valid
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('*')
      .eq('token', inviteToken)
      .eq('used', false)
      .single();

    if (inviteError || !invite) {
      setError('Invalid or expired invite token');
      return;
    }

    // Proceed with signup using Supabase Auth
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Mark the invite as used
    await supabase
      .from('invites')
      .update({ used: true })
      .eq('token', inviteToken);

    // Redirect or do something after successful signup
    alert('Signup successful!');
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          type="text"
          value={inviteToken}
          onChange={(e) => setInviteToken(e.target.value)}
          placeholder="Invite Token"
        />
        <button type="submit">Sign Up</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}