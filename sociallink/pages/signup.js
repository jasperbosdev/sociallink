import { useState } from 'react';
import { supabase } from '../src/app/supabase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [username, setUsername] = useState(''); // New username state
  const [inviteToken, setInviteToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check for matching passwords
    if (password !== passwordAgain) {
      setError('Passwords do not match');
      return;
    }

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

    // Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Ensure user ID is available before inserting into users
    if (signUpData.user?.id) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([{ id: signUpData.user.id, username }]); // Insert the username with user ID

      if (profileError) {
        setError(profileError.message);
        return;
      }
    } else {
      setError('User ID is not available after signup');
      return;
    }

    // Mark the invite token as used
    await supabase
      .from('invites')
      .update({ used: true })
      .eq('token', inviteToken);

    // Set success message
    setSuccess('Signup successful! Please check your email for confirmation.');

    // Clear the input fields
    setEmail('');
    setPassword('');
    setPasswordAgain('');
    setUsername('');
    setInviteToken('');
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Invite Token"
          value={inviteToken}
          onChange={(e) => setInviteToken(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </form>
    </div>
  );
}