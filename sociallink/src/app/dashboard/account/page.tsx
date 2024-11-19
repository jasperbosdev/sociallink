'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';
import Nav from '../components/nav';
import { useUserData } from ".././profile/util/useUserData";

export default function Dashboard() {
  const { loading, userData } = useUserData();
  const [accountInfo, setAccountInfo] = useState<any[]>([]);
  const router = useRouter();

  // State for form inputs
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [usernameCurrentPassword, setUsernameCurrentPassword] = useState(''); // For username change
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(''); // For success/error messages

  // Handle form submissions
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message before processing
  
    try {
      // Get the current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
  
      if (!user || sessionError) {
        setMessage('User is not authenticated.');
        return;
      }
  
      // Re-authenticate the user with the current password for security
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: usernameCurrentPassword, // Use usernameCurrentPassword here
      });
  
      if (signInError) {
        setMessage('Current password is incorrect.');
        return;
      }
  
      // Fetch public user data
      const { data: publicUserData, error: publicUserError } = await supabase
        .from("users")
        .select("uid, username")
        .eq("id", user.id)
        .single();
  
      if (publicUserError) {
        setMessage(`Failed to fetch user data: ${publicUserError.message}`);
        return;
      }
  
      const { uid, username: currentUsername } = publicUserData;
  
      // Update the username in the users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ username })
        .eq('uid', uid);
  
      if (updateError) {
        setMessage(`Username change failed: ${updateError.message}`);
        return;
      }
  
      // Buckets and file naming logic
      const buckets = [
        { bucket: 'avatars', oldFile: `${currentUsername}-pfp`, newFile: `${username}-pfp` },
        { bucket: 'backgrounds', oldFile: `${currentUsername}-bg`, newFile: `${username}-bg` },
        { bucket: 'banners', oldFile: `${currentUsername}-banner`, newFile: `${username}-banner` },
        { bucket: 'cursors', oldFile: `${currentUsername}-cursor`, newFile: `${username}-cursor` },
        { bucket: 'songs', oldFile: `${currentUsername}-audio`, newFile: `${username}-audio` },
      ];
  
      for (const { bucket, oldFile, newFile } of buckets) {
        // Check if the old file exists
        const { data: fileExists, error: fileError } = await supabase.storage
          .from(bucket)
          .list('', { search: oldFile });
  
        if (fileError) {
          console.error(`Error checking file in bucket ${bucket}:`, fileError.message);
          continue; // Skip to the next bucket
        }
  
        if (fileExists && fileExists.length > 0) {
          // Copy the file to the new name
          const { error: copyError } = await supabase.storage
            .from(bucket)
            .move(oldFile, newFile);
  
          if (copyError) {
            console.error(`Error renaming file in bucket ${bucket}:`, copyError.message);
          } else {
            console.log(`File renamed in ${bucket}: ${oldFile} -> ${newFile}`);
          }
        }
      }
  
      setMessage('Username and files updated successfully.');
    } catch (nameError) {
      setMessage(`Error: ${nameError.message}`);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message before processing
  
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
  
      if (!user || sessionError) {
        setMessage('User is not authenticated.');
        return;
      }
  
      // Re-authenticate the user with the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
  
      if (signInError) {
        setMessage('Current password is incorrect.');
        return;
      }
  
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  
      if (updateError) {
        setMessage(`Password change failed: ${updateError.message}`);
      } else {
        setMessage('Password updated successfully.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Fetch user/account data
  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (loading || !userData) {
        return;
      }

      const { id, username } = userData;
      const { data: publicUserData, error: publicUserError } = await supabase
        .from("users")
        .select("uid")
        .eq("id", id)
        .single();

      if (publicUserError) {
        console.error(publicUserError);
        return;
      }

      const uid = publicUserData.uid;
      const { data: invitesData, error: invitesError } = await supabase
        .from("invites")
        .select("*")
        .eq("used_by", username);

      if (invitesError) {
        console.error(invitesError);
        return;
      }

      setAccountInfo(invitesData);
    };

    fetchAccountInfo();
  }, [loading, userData]);

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
                    <span className='font-bold'>userid: </span>{userData?.uid}<br />
                    <span className='font-bold'>email: </span>{userData?.email}<br />
                    <span className='font-bold'>username: </span>{userData?.username}<br />
                    <span className='font-bold'>rank: </span>{userData?.role}<br />
                    <span className='font-bold'>invite by: </span>{accountInfo.length > 0 ? accountInfo[0].created_by : 'N/A'}<br />
                    <span className='font-bold'>join date: </span>{userData ? new Date(userData.created_at).toLocaleDateString('en-GB') : ''}<span className='text-sm'> (dd-mm-yy)</span><br />
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
                      Disable Profile (?)
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex gap-4 w-full">
                  <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                    <h2 className="text-white font-bold text-xl pb-2">Change Username</h2>
                    <form onSubmit={handleUsernameChange} className="flex flex-col gap-[0.7em]" autoComplete='off'>
                      <input
                      type="text"
                      placeholder="New Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-zinc-800 text-white rounded-md p-2 border border-2 border-white/20 focus:outline-none"
                      autoComplete='off'
                      />
                      <input
                      type="password"
                      placeholder="Current Password"
                      value={usernameCurrentPassword}
                      onChange={(e) => setUsernameCurrentPassword(e.target.value)}
                      className="bg-zinc-800 text-white rounded-md p-2 border border-2 border-white/20 focus:outline-none"
                      autoComplete='new-password'
                      />
                      <button
                      type="submit"
                      className="bg-zinc-800 py-2 text-white rounded-md border border-2 border-white/20 font-bold cursor-pointer hover:scale-[1.02] transition"
                      >
                      Update Username
                      </button>
                      {message && <p className="text-white">{message}</p>}
                    </form>
                    </div>

                    <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                    <h2 className="text-white font-bold text-xl pb-2">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="flex flex-col gap-[0.7em]" autoComplete='off'>
                      <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-zinc-800 text-white rounded-md p-2 border border-2 border-white/20 focus:outline-none"
                      autoComplete='new-password'
                      />
                      <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-zinc-800 text-white rounded-md p-2 border border-2 border-white/20 focus:outline-none"
                      autoComplete='new-password'
                      />
                      <button
                      type="submit"
                      className="bg-zinc-800 py-2 text-white rounded-md border border-2 border-white/20 font-bold cursor-pointer hover:scale-[1.02] transition"
                      >
                      Update Password
                      </button>
                      {message && <p className="text-white">{message}</p>}
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