'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../supabase';

export default function SignIn() {
  const [username, setUsername] = useState(''); // Username input
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Fetch the user's email based on the username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('uid, email') // Make sure to select the uid
      .eq('username', username)
      .single();

    if (userError || !user) {
      console.error('User fetch error:', userError);
      setError('Invalid username');
      return;
    }

    // Sign in the user using their email and password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (signInError) {
      console.error('Sign-in error:', signInError.message);
      setError(signInError.message);
      return;
    }

    console.log('Login successful for username:', username);

    // Check for existing login today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to start of the next day

    const { data: existingLogins, error: loginFetchError } = await supabase
      .from('logins')
      .select('*')
      .eq('user_id', user.uid)
      .gte('login_time', today.toISOString())
      .lt('login_time', tomorrow.toISOString());

    if (loginFetchError) {
      console.error('Login fetch error:', loginFetchError);
      // Handle fetch error if needed
    } else if (existingLogins.length === 0) {
      // If no login exists for today, insert a new login
      const { error: loginError } = await supabase
        .from('logins')
        .insert([{ user_id: user.uid, login_time: new Date() }]);

      if (loginError) {
        console.error('Login tracking error:', loginError);
        // You might want to show an error message to the user if this fails
      }
    }

    // Redirect on successful sign-in
    router.push('/dashboard');
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
            Log in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
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

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
                <div className="text-sm">
                  <div onClick={() => router.push('/forgot-password')} className="cursor-pointer font-semibold text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </div>
                </div>
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
                  className="border border-[2.75px] block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleSignIn}
                disabled={!username || !password}
                className="border border-[2.75px] border-white/60 disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Login
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <p className="mt-1 text-center font-semibold text-indigo-400 hover:text-indigo-300 text-sm hover:cursor-pointer" onClick={() => router.push('/register')}>
            Don't have an account?{' Register now!'}
          </p>
        </div>
      </div>
    </div>
  );
}