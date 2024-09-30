'use client';
import { useState } from 'react';
import { supabase } from '../supabase'; // Adjust the path as needed
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [username, setUsername] = useState(''); // New state for the username
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for matching passwords
    if (password !== passwordAgain) {
      setError('Passwords do not match');
      return;
    }

    // Verify the invite token
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
      const { error: userError } = await supabase
        .from('users') // Insert into the new users table
        .insert([{ id: signUpData.user.id, username, email }]); // Include email if needed

      if (userError) {
        setError(userError.message);
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
    setInviteToken('');
    setUsername('');
  };

  return (
    <div className="my-14">
      <div className="flex min-h-full flex-1 flex-col justify-center py-6 lg:px-8 border border-[0.35em] border-white/60 w-1/4 mx-auto rounded-2xl bg-white/15">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
              className="mx-auto h-20 w-auto"
              src="/static/logo.png"
              alt="Your Company"
          />
          <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Register
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-4">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border border-[2.75px] block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border border-[2.75px] block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border border-[2.75px] block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Confirm Password field */}
            <div>
              <label htmlFor="passwordAgain" className="block text-sm font-medium leading-6 text-white">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="passwordAgain"
                  name="passwordAgain"
                  type="password"
                  autoComplete="current-password"
                  value={passwordAgain}
                  onChange={(e) => setPasswordAgain(e.target.value)}
                  required
                  className="border border-[2.75px] block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Invite Token field */}
            <div>
              <label htmlFor="inviteToken" className="block text-sm font-medium leading-6 text-white">
                Invite Token
              </label>
              <div className="mt-2">
                <input
                  id="inviteToken"
                  name="inviteToken"
                  type="text"
                  value={inviteToken}
                  onChange={(e) => setInviteToken(e.target.value)}
                  required
                  className="border border-[2.75px] block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Signup Button */}
            <div>
              <button
                onClick={signup}
                disabled={!username || !email || !password || !passwordAgain || password !== passwordAgain}
                className="border border-[2.75px] border-white/60 disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && <p className="text-green-500 text-center mt-4">{success}</p>}

          {/* Link to login page */}
          <p className="mt-1 text-center font-semibold text-indigo-400 hover:text-indigo-300 text-sm hover:cursor-pointer" onClick={() => router.push('/login')}>
            Already have an account?{' Sign In'}
          </p>
        </div>
      </div>
    </div>
  );
}