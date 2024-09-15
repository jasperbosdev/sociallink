'use client';
import { useState } from 'react';
import { supabase } from '../supabase'; // Adjust the path as needed
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const signup = async (e) => {
    e.preventDefault();
    
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
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Mark the invite token as used
    await supabase
      .from('invites')
      .update({ used: true })
      .eq('token', inviteToken);

    setSuccess('Signup successful! Please check your email for confirmation.');
    setEmail('');
    setPassword('');
    setPasswordAgain('');
    setInviteToken('');
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-20 w-auto"
          src="/static/logo.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign up
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
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
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="passwordAgain" className="block text-sm font-medium leading-6 text-white">
                Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="passwordAgain"
                name="passwordAgain"
                type="password"
                autoComplete="current-password"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="inviteToken" className="block text-sm font-medium leading-6 text-white">
                Invite Token
              </label>
              <div onClick={() => router.push('#/')} className="cursor-pointer text-sm font-semibold text-indigo-400 hover:text-indigo-300">
                  What's this?
                </div>
            </div>
            <div className="mt-2">
              <input
                id="inviteToken"
                name="inviteToken"
                type="text"
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value)}
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              onClick={signup}
              disabled={!email || !password || !passwordAgain || password !== passwordAgain}
              className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && <p className="text-green-500 text-center mt-4">{success}</p>}

        <p className="mt-10 text-center text-sm text-gray-400">
          Already a member?{' '}
          <button onClick={() => router.push('/login')} className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}