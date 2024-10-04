'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';
import Nav from '../components/nav';

export default function Dashboard() {
  const router = useRouter();

  // State for form inputs
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Handle form submissions (You can add your logic here)
  const handleUsernameChange = (e) => {
    e.preventDefault();
    // Logic to change the username
    console.log('Change Username:', username, 'with Current Password:', currentPassword);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Logic to change the password
    console.log('Change Password:', newPassword, 'with Current Password:', currentPassword);
  };

  return (
    <>
      <div className="flex">
        <Nav />
        <div className="flex flex-col justify-center items-center w-full px-4 mt-8">
          <div className="bg-[#101013] rounded-lg w-full relative sm:p-4 p-2 mb-4 max-w-6xl border border-4 rounded-xl border-white/20">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2 className="text-white font-bold text-xl pb-2">Account Information</h2>
                  <p className="text-white">
                    <span className='font-bold'>userid: </span>43224<br />
                    <span className='font-bold'>email: </span>johndoe@gmail.com<br />
                    <span className='font-bold'>username: </span>John_Doe<br />
                    <span className='font-bold'>rank: </span>User<br />
                    <span className='font-bold'>invite by: </span>User<br />
                    <span className='font-bold'>join date: </span>01-02-2024 04:20:69<br />
                  </p>
                </div>
                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full h-fit rounded-md p-4">
                  <h2 className="text-white font-bold text-xl pb-2">Account Options</h2>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-zinc-800 py-[7px] text-white rounded-md my-1 border-[3px] border-white/20 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit">
                      (re)Link Discord
                    </div>
                    <div className="bg-zinc-800 py-[7px] text-white rounded-md my-1 border-[3px] border-white/20 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit">
                      Link osu!
                    </div>
                    <div className="bg-zinc-800 py-[7px] text-white rounded-md my-1 border-[3px] border-white/20 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit">
                      Disable Profile (?){/* maybe add hover using tooltip explaining this feature */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex gap-4 w-full">
                  {/* Change Username Form */}
                  <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                    <h2 className="text-white font-bold text-xl pb-2">Change Username</h2>
                    <form onSubmit={handleUsernameChange} className="flex flex-col gap-[0.7em]">
                      <input
                        type="text"
                        placeholder="New Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-zinc-800 text-white rounded-md p-2 border border-2 border-white/20 focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-zinc-800 text-white rounded-md p-2 border border-2 border-white/20 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-zinc-800 py-2 text-white rounded-md border border-2 border-white/20 font-bold cursor-pointer hover:scale-[1.02] transition"
                      >
                        Update Username
                      </button>
                    </form>
                  </div>

                  {/* Change Password Form */}
                  <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                    <h2 className="text-white font-bold text-xl pb-2">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="flex flex-col gap-[0.7em]">
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-zinc-800 text-white rounded-md p-2 border border-2 border-white/20 focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-zinc-800 text-white rounded-md p-2 border border-2 border-white/20 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-zinc-800 py-2 text-white rounded-md border border-2 border-white/20 font-bold cursor-pointer hover:scale-[1.02] transition"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}