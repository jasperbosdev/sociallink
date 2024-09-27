import { useState } from 'react';
import { supabase } from '../src/app/supabase';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState(''); // Update to use username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Fetch the user's email using the username from the users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('username', username)
      .single();

    if (userError || !user) {
      setError('Invalid username');
      return;
    }

    // Sign in using Supabase Auth with the retrieved email
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email, // Use the email for authentication
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    alert('Login successful!');
    router.push('/dashboard');
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text" // Change type to text for username input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}