'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabase';
import Nav from '../../components/nav';

type BadgeUser = {
  id: number;
  uid: string;
  icon: string;
  icon_style: string;
  username: string;
  assigned_by: string;
  assigned_on: string;
};

export default function InvitePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const badgeUsersPerPage = 5;
  const [badges, setBadges] = useState<{ id: number; badge: string; icon: string; icon_style: string }[]>([]);
  const [badgeUsers, setBadgeUsers] = useState<BadgeUser[]>([]);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  const [iconStyle, setIconStyle] = useState('fas');
  const [icon, setIcon] = useState('');
  const [badgeName, setBadgeName] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const hideFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
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

  // Fetch badges from Supabase
  const fetchBadges = async () => {
    setLoading(true);
    const { data: badgesData, error } = await supabase
      .from('badges')
      .select('id, badge, icon, icon_style')
      .order('id', { ascending: true });

    if (error) {
      setError('Failed to fetch badges');
      setLoading(false);
      return;
    }

    setBadges(badgesData || []);
    setLoading(false);
  };

  // Fetch users with badges
  const fetchBadgeUsers = async () => {
    setLoading(true);
    const { data: badgeUsersData, error } = await supabase
      .from('badges')
      .select('*')
      .range((currentPage - 1) * badgeUsersPerPage, currentPage * badgeUsersPerPage - 1)
      .order('id', { ascending: true });

    if (error) {
      setError('Failed to fetch users with badges');
      setLoading(false);
      return;
    }

    setBadgeUsers(badgeUsersData || []);
    const totalUsers = badgeUsersData?.length || 0;
    setTotalPages(Math.ceil(totalUsers / badgeUsersPerPage));

    setLoading(false);
  };

  // Handle row deletion
  const handleDeleteUser = async (userId: number) => {
    if (!isAdmin) return;

    setLoading(true);

    const { error } = await supabase.from('badges').delete().eq('id', userId);

    if (error) {
      setError('Failed to delete user');
    } else {
      setBadgeUsers((prevBadgeUsers) => prevBadgeUsers.filter((user) => user.id !== userId));
    }

    setLoading(false);
  };

  // Handle badge assignment
  const handleAssignBadge = async () => {
    if (!username || !icon || !badgeName) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();

    // Fetch the username from the public users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('username')
      .eq('id', sessionData?.session?.user?.id)
      .single();

    if (userError) {
      setError('Failed to fetch user data');
      setLoading(false);
      return;
    }

    // Fetch the UID from the public users table
    const { data: userUidData, error: uidError } = await supabase
      .from('users')
      .select('uid')
      .eq('id', sessionData?.session?.user?.id)
      .single();

    if (uidError) {
      setError('Failed to fetch user UID');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('badges') // Update this table name to match your structure
      .insert([
      {
        uid: userUidData?.uid,
        icon: icon,
        icon_style: iconStyle,
        badge: badgeName,
        username: username,
        assigned_by: userData?.username,
        assigned_on: new Date().toISOString(),
      },
      ]);

    if (error) {
      setError('Failed to assign badge');
    } else {
      // Refresh badge users after successful assignment
      fetchBadgeUsers();
    }

    setLoading(false);
  };

  useEffect(() => {
    hideFooter();
    fetchBadges();
    fetchBadgeUsers();
    checkUserRole(); // Check the user's role
  }, [currentPage]);

  return (
    <>
      <div className="flex">
        <Nav />
        <div className="flex flex-col justify-center items-center w-full px-4 mt-8">
          <div className="container mx-auto max-w-6xl p-6 border border-4 border-white/20 rounded-lg bg-[#101013]">
            <div className="flex flex-row space-x-4">
              <div className="bg-zinc-900 p-4 rounded-lg">
                <h1 className="text-2xl font-bold mb-2">Badge Management</h1>
                <p>Assign, edit or remove badges from users.<br /></p>
              </div>

              {/* Existing Badges Table */}
              <div className="bg-zinc-900 p-4 rounded-lg flex-1">
                <h2 className="text-2xl font-bold mb-2">Existing Badges</h2>
                <div className="border border-4 border-white/20 rounded-lg">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-2 border-r border-white/20">ID</th>
                        <th className="text-left p-2 border-r border-white/20">Badge Icon</th>
                        <th className="text-left p-2">Badge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!loading && badges.length > 0 ? (
                        badges.map((badge) => (
                          <tr key={badge.id} className="border-b border-white/20">
                            <td className="p-2 border-r border-white/20">
                              <p className="text-white"><span className="font-bold">{badge.id}</span></p>
                            </td>
                            <td className="p-2 border-r border-white/20">
                              <p className="text-white">
                                <span className="font-bold">
                                  <i className={`${badge.icon_style} fa-${badge.icon} fa-xl`}></i>
                                </span>
                              </p>
                            </td>
                            <td className="p-2">
                              <p className="text-white"><span className="font-bold">{badge.badge}</span></p>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-2 text-white">
                            {loading ? 'Loading badges...' : 'No badges available'}
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
              <h2 className="text-2xl font-bold mb-2">Users with Badges</h2>
              <div className="border border-4 border-white/20 rounded-lg">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2 border-r border-white/20 text-center">ID</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">UID</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Icon</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Badge</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Username</th>
                      <th className="text-left p-2 border-r border-white/20 text-center">Assigned By</th>
                      <th className="text-left p-2 text-center border-r border-white/20">Assigned On</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && badgeUsers.length > 0 ? (
                      badgeUsers.map((user) => (
                        <tr key={user.id} className="border-b border-white/20">
                          <td className="p-2 border-r border-white/20 text-center">{user.id}</td>
                          <td className="p-2 border-r border-white/20 text-center">{user.uid}</td>
                          <td className="p-2 border-r border-white/20 text-center">
                            <i className={`${user.icon_style} fa-${user.icon} fa-xl`}></i>
                          </td>
                          <td className="p-2 border-r border-white/20 text-center">{user.badge}</td>
                          <td className="p-2 border-r border-white/20 text-center">{user.username}</td>
                          <td className="p-2 border-r border-white/20 text-center">{user.assigned_by}</td>
                          <td className="p-2 border-r border-white/20 text-center">{user.assigned_on}</td>
                          <td className="p-2 text-center">
                            {isAdmin && (
                                <div
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this users badge?')) {
                                  handleDeleteUser(user.id);
                                  }
                                }}
                                className="cursor-pointer"
                                >
                                ❌
                                </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-2 text-white">
                          {loading ? 'Loading users...' : 'No users with badges found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Badge Assignment Form */}
            {isAdmin && (
              <div className="bg-zinc-900 p-4 rounded-lg mt-4">
                <h2 className="text-2xl font-bold mb-2">Assign a Badge</h2>

                <div className="flex flex-row space-x-4">
                  <div className="flex flex-col">
                    <label htmlFor="iconStyle" className="text-white mb-2 font-bold">Icon Style</label>
                    <select
                      id="iconStyle"
                      value={iconStyle}
                      onChange={(e) => setIconStyle(e.target.value)}
                      className="p-2 border border-[3px] border-white/20 rounded-lg bg-zinc-800 text-white"
                    >
                      <option value="fas">fas</option>
                      <option value="far">far</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="icon" className="text-white mb-2 font-bold">Fontawesome Icon</label>
                    <input
                      type="text"
                      id="icon"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="p-2 border border-[3px] border-white/20 rounded-lg bg-zinc-800 text-white"
                      placeholder="cart-shopping"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="badgeName" className="text-white mb-2 font-bold">Badge Name</label>
                    <input
                      type="text"
                      id="badgeName"
                      value={badgeName}
                      onChange={(e) => setBadgeName(e.target.value)}
                      className="p-2 border border-[3px] border-white/20 rounded-lg bg-zinc-800 text-white"
                      placeholder="Big Spender"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="username" className="text-white mb-2 font-bold">Assign to</label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="p-2 border border-[3px] border-white/20 rounded-lg bg-zinc-800 text-white"
                      placeholder="leeuwz"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAssignBadge}
                  className="bg-zinc-800 border border-[3px] border-white/20 text-white py-2 px-4 rounded-lg mt-4"
                >
                  Assign Badge
                </button>

                {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}