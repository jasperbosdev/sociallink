'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabase';
import Nav from '../../components/nav';

export default function InvitePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  const router = useRouter();
  const [highPrivUsers, setHighPrivUsers] = useState<[]>([]);
  const [allUsers, setAllUsers] = useState('');
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmationDelText, setConfirmationDelText] = useState('');
  const [currentDelUser, setDelCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const [confirmationResetText, setConfirmationResetText] = useState('');
  const [currentResetUser, setResetCurrentUser] = useState<{ id: string; username: string } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(allUsers.length / usersPerPage);

  // Slice users for current page
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = allUsers.slice(startIndex, startIndex + usersPerPage);

  // Handle previous page click
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page click
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const hideFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  };

  const checkAdmin = async () => {
    setLoading(true); // Start the loading state

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      router.push('/login'); // Redirect to login if no session
      return;
    }

    const { data: userRole, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (roleError || userRole?.role !== 'admin') {
      router.push('/not-authorized'); // Redirect to not authorized if not admin
      return;
    }

    setIsAdmin(true); // Mark as admin
    setLoading(false); // Stop the loading state
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  const fetchHighPrivUsers = async () => {
    setLoading(true);
    const { data: highPrivUsers, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin');

    if (error) {
      setError('Failed to fetch users with higher privileges');
      setLoading(false);
      return;
    }

    setHighPrivUsers(highPrivUsers);
    console.log('Users with a high privilege', highPrivUsers);
    setLoading(false);
  };

  const fetchAllUsers = async () => {
    setLoading(true);
  
    const { data: allUsers, error } = await supabase
      .from('users')
      .select('*')
      .order('uid', { ascending: true }); // Sort by UID in descending order
  
    if (error) {
      setError('Failed to fetch all users');
      setLoading(false);
      return;
    }
  
    setAllUsers(allUsers);
    console.log('All users', allUsers);
    setLoading(false);
  };  

  useEffect(() => {
    if (isAdmin) {
      fetchHighPrivUsers();
      fetchAllUsers();
    }
  }, [isAdmin]);

  const toggleUserHidden = async (userId: string, currentHiddenStatus: boolean) => {
    setLoading(true); // Indicate loading state
    setError(null); // Reset error state
  
    try {
      const newHiddenStatus = !currentHiddenStatus;
  
      const { error: updateError } = await supabase
        .from('users')
        .update({ hidden: newHiddenStatus })
        .eq('id', userId);
  
      if (updateError) {
        throw new Error('Failed to update hidden status');
      }
  
      // Update the state to reflect the change
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, hidden: newHiddenStatus } : user
        )
      );
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteUserUploads = async (userId: string, username: string) => {
    setLoading(true); // Indicate loading state
    setError(null); // Reset error state
  
    const buckets = [
      { bucket: "avatars", fileName: `${username}-pfp`, versionColumn: "pfp_vers" },
      { bucket: "backgrounds", fileName: `${username}-bg`, versionColumn: "bg_vers" },
      { bucket: "banners", fileName: `${username}-banner`, versionColumn: "banner_vers" },
      { bucket: "cursors", fileName: `${username}-cursor`, versionColumn: "cursor_vers" },
      { bucket: "songs", fileName: `${username}-audio`, versionColumn: "audio_vers" },
    ];
  
    let versionsToUpdate: Record<string, number> = {}; // Tracks version increments
  
    try {
      for (const { bucket, fileName, versionColumn } of buckets) {
        // Check if the file exists in the bucket
        const { data: files, error: listError } = await supabase.storage
          .from(bucket)
          .list("", { search: fileName });
  
        if (listError) {
          console.error(`Error checking for file in ${bucket}:`, listError);
          continue;
        }
  
        if (files && files.length > 0) {
          // Attempt to delete the file
          const { error: deleteError } = await supabase.storage
            .from(bucket)
            .remove([fileName]);
  
          if (deleteError) {
            console.error(`Error deleting file from ${bucket}:`, deleteError);
          } else {
            // Increment the corresponding version column
            versionsToUpdate[versionColumn] = (versionsToUpdate[versionColumn] || 0) + 1;
          }
        }
      }
  
      // Increment version columns in the database if any files were successfully deleted
      if (Object.keys(versionsToUpdate).length > 0) {
        const { data: user, error: fetchError } = await supabase
          .from("users")
          .select("pfp_vers, bg_vers, banner_vers, cursor_vers, audio_vers")
          .eq("id", userId)
          .single();
  
        if (fetchError || !user) {
          throw new Error("Error fetching user version columns.");
        }
  
        // Construct update payload
        const updatedVersions = Object.fromEntries(
          Object.entries(versionsToUpdate).map(([key, increment]) => [key, user[key] + increment])
        );
  
        const { error: updateError } = await supabase
          .from("users")
          .update(updatedVersions)
          .eq("id", userId);
  
        if (updateError) {
          throw new Error("Error updating version columns.");
        }
      }
  
      const { data: userUid, error: uidError } = await supabase
        .from('users')
        .select('uid')
        .eq('id', userId)
        .single();

      if (uidError || !userUid) {
        throw new Error('Error fetching user UID.');
      }

      const uid = userUid.uid;

      // Update `profileCosmetics` table and set `use_autoplayfix` to FALSE
      const { error: cosmeticsError } = await supabase
        .from("profileCosmetics")
        .update({ use_autoplayfix: false })
        .eq("uid", uid);
  
      if (cosmeticsError) {
        throw new Error("Error updating profileCosmetics use_autoplayfix column.");
      }
  
      // Optionally update state to reflect the deletion
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, uploadsDeleted: true } // Mark uploads as deleted
            : user
        )
      );
    } catch (err) {
      setError(err.message || "An unexpected error occurred while deleting uploads.");
      console.error(err);
    } finally {
      setLoading(false); // Indicate loading state completion
    }
  };  

  const resetUserProfile = async (userId: string) => {
    setLoading(true); // Indicate loading state
    setError(null); // Reset error state
  
    try {
      // Fetch UID for the user
      const { data: userUid, error: uidError } = await supabase
        .from("users")
        .select("uid")
        .eq("id", userId)
        .single();
  
      if (uidError || !userUid) {
        throw new Error("Error fetching user UID.");
      }
  
      const uid = userUid.uid;
  
      // Reset all columns in the "profileCosmetics" table to their default values
      const { error: updateError } = await supabase
        .from("profileCosmetics")
        .update({
          border_width: 3,
          bg_color: null,
          username_fx: false,
          card_glow: false,
          show_views: false,
          border_radius: 0.5,
          card_opacity: 90,
          card_blur: 0,
          background_blur: 0,
          background_brightness: 100,
          pfp_decoration: false,
          decoration_value: "",
          card_tilt: false,
          show_badges: false,
          rounded_socials: false,
          primary_color: "0,0,0",
          secondary_color: "101013",
          accent_color: "FFFFFF",
          text_color: "FFFFFF",
          background_color: "10,10,13",
          embed_color: "09090B",
          profile_font: "geistSans",
          usernamefx_color: "",
          use_banner: false,
          use_autoplayfix: false,
          use_backgroundaudio: false,
        })
        .eq("uid", uid);
  
      if (updateError) {
        throw new Error("Error updating user settings in profileCosmetics.");
      }
  
      // Tables to reset by deleting rows associated with the user
      const tablesToReset = [
        "profileCustom",
        "profileEmbed",
        "profileSocial",
        "profileGeneral",
        "profile_views",
        "socials",
      ];
  
      for (const table of tablesToReset) {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq("uid", uid);
  
        if (deleteError) {
          console.error(`Error deleting rows from ${table}:`, deleteError);
        }
      }
  
      alert("Profile reset successfully without deleting uploads!");
    } catch (err) {
      setError(err.message || "An unexpected error occurred while resetting the profile.");
      console.error(err);
    } finally {
      setLoading(false); // Indicate loading state completion
    }
  };

  // Fetch the session's user role
  const checkUserRole = async () => {
    const { data: sessionData, error } = await supabase.auth.getSession();

    if (error) {
      setError('Failed to fetch session');
      return;
    }

    const { data: userRoleData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', sessionData?.session?.user?.id);

    if (roleError) {
      setError('Failed to fetch user role');
      return;
    }

    // Check if the user has an 'admin' role
    if (userRoleData && userRoleData[0]?.role === 'admin') {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    hideFooter();
    checkUserRole();
  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while checking admin status
  }

  return (
    <>
      <div className="flex">
        <Nav />
        <div className="flex flex-col justify-center items-center w-full px-4 mt-8">
          <div className="container mx-auto max-w-6xl p-6 border border-4 border-white/20 rounded-lg bg-[#101013]">
            <div className="flex flex-row space-x-4">
              <div className="bg-zinc-900 p-4 rounded-lg">
                <h1 className="text-2xl font-bold mb-2">User Management</h1>
                <p>Disable, hide profiles and remove unwanted content.<br /></p>
              </div>

              {/* Existing Badges Table */}
              <div className="bg-zinc-900 p-4 rounded-lg flex-1">
                <h2 className="text-2xl font-bold mb-2">Users with higher privileges</h2>
                <div className="border border-4 border-white/20 rounded-lg">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-2 border-r border-white/20 text-center">UID</th>
                        <th className="text-left p-2 border-r border-white/20 text-center">User</th>
                        <th className="text-left p-2 text-center">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!loading && highPrivUsers.length > 0 ? (
                        highPrivUsers.map((highPrivUser) => (
                          <tr key={highPrivUser.uid} className="border-b border-white/20">
                            <td className="p-2 border-r border-white/20">
                              <p className="text-white"><span className="font-bold">{highPrivUser.uid}</span></p>
                            </td>
                            <td className="p-2 border-r border-white/20">
                              <p className="text-white">
                                <span className="font-bold">
                                {highPrivUser.username}
                                </span>
                              </p>
                            </td>
                            <td className="p-2">
                              <p className="text-white"><span className="font-bold">{highPrivUser.role}</span></p>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-2 text-white">
                            {loading ? 'Loading badges...' : 'No high privilege users available'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Badge Users Table */}
            <div className="bg-zinc-900 p-4 rounded-lg mt-4">
              <h2 className="text-2xl font-bold mb-2">Users</h2>
              <div className="border border-4 border-white/20 rounded-lg">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2 border-r border-white/20 text-center">UID</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Role</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Email</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Username</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Join Date</th>
                      <th className="text-left p-2 text-center border-r border-white/20">Hidden</th>
                      <th className="text-left p-2 text-center border-r border-white/20">Delete Uploads</th>
                      <th className="text-center p-2">Reset Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && currentUsers.length > 0 ? (
                      currentUsers.map((allUser) => (
                        <tr key={allUser.id} className="border-b border-white/20">
                          <td className="p-2 border-r border-white/20 text-center">{allUser.uid}</td>
                          <td className="p-2 border-r border-white/20 text-center font-bold">{allUser.role}</td>
                          <td className="p-2 border-r border-white/20 text-center">{allUser.email}</td>
                          <td className="p-2 border-r border-white/20 text-center">
                            <a className="font-bold text-blue-600" href={`/u/${allUser.username}`} target="_blank">
                              {allUser.username}
                            </a>
                          </td>
                          <td className="p-2 border-r border-white/20 text-center">{new Date(allUser.created_at).toLocaleString()}</td>
                          <td className="p-2 border-r border-white/20 text-center">
                            <div
                              className="select-none flex justify-center items-center cursor-pointer p-1 bg-green-600 border-2 border-green-900 rounded-xl"
                              onClick={() => {
                                const confirmAction = window.confirm(
                                  `Are you sure you want to ${allUser.hidden ? "unhide" : "hide"} ${allUser.username}'s profile?`
                                );
                                if (confirmAction) {
                                  toggleUserHidden(allUser.id, allUser.hidden);
                                }
                              }}
                            >
                              {allUser.hidden ? "Unhide 👨‍🦯" : "Hide 👁️"}
                            </div>
                          </td>
                          <td className="p-2 border-r border-white/20 text-center">
                            <div
                              className="flex justify-center items-center cursor-pointer p-1 bg-red-600 border-2 border-red-900 rounded-xl"
                              onClick={() => {
                                setDelCurrentUser({ id: allUser.id, username: allUser.username });
                                setDeleteModalOpen(true);
                              }}
                            >
                              Delete 🗑️
                            </div>
                          </td>
                          <td className="p-2 border-r border-white/20 text-center">
                            <div
                              className="flex justify-center items-center cursor-pointer p-1 bg-red-600 border-2 border-red-900 rounded-xl"
                              onClick={() => {
                                setResetCurrentUser({ id: allUser.id, username: allUser.username });
                                setResetModalOpen(true);
                              }}
                            >
                              Reset 🔄
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-2 text-white">
                          {loading ? "Loading users..." : "No users found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-2 max-w-64">
                <button
                  className="p-2 bg-gray-500 text-white rounded"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="p-2 bg-gray-500 text-white rounded"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* POP-UP MODALS */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#101013] border-4 border-white/20 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="text-sm mb-4">
              Type <strong>"Confirm upload deletion for {currentDelUser?.username}"</strong> to proceed.
            </p>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 text-black"
              value={confirmationDelText}
              onChange={(e) => setConfirmationDelText(e.target.value)}
              placeholder={`Confirm upload deletion for ${currentDelUser?.username}`}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-red-600 shadow-none text-white px-4 py-2 rounded-md"
                disabled={confirmationDelText !== `Confirm upload deletion for ${currentDelUser?.username}`}
                onClick={() => {
                  if (currentDelUser) {
                    deleteUserUploads(currentDelUser.id, currentDelUser.username);
                  }
                  setDeleteModalOpen(false);
                  setConfirmationDelText('');
                }}
              >
                Confirm
              </button>
              <button
                className="bg-gray-600 shadow-none text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setConfirmationDelText('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isResetModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#101013] border-4 border-white/20 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="text-sm mb-4">
              Type <strong>"Confirm profile reset for {currentResetUser?.username}"</strong> to proceed.
            </p>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 text-black"
              value={confirmationResetText}
              onChange={(e) => setConfirmationResetText(e.target.value)}
              placeholder={`Confirm profile reset for ${currentResetUser?.username}`}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-red-600 shadow-none text-white px-4 py-2 rounded-md"
                disabled={confirmationResetText !== `Confirm profile reset for ${currentResetUser?.username}`}
                onClick={() => {
                  if (currentResetUser) {
                    resetUserProfile(currentResetUser.id);
                  }
                  setResetModalOpen(false);
                  setConfirmationResetText('');
                }}
              >
                Confirm
              </button>
              <button
                className="bg-gray-600 shadow-none text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setResetModalOpen(false);
                  setConfirmationResetText('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}