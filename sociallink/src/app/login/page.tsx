'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../supabase';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Sign in using Supabase Auth
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    // Redirect on successful sign-in
    router.push('/dashboard');
  };

  return (
    <>
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
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                  Username
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
                  disabled={!email || !password}
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
    </>
  );
}