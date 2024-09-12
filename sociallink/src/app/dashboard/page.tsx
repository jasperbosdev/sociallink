'use client';

import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });
  return (
    <div className="p-8">
      <div className='text-white'>{session?.data?.user?.email }</div>
      <button className='text-white' onClick={() => signOut()}>Logout</button>
    </div>
  )
}

Dashboard.requireAuth = true