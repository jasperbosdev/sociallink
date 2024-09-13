// pages/admin/invite.js
import { useState } from 'react';

export default function InvitePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInviteCreation = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/create-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Invite created: ${data.token}`);
        // Optionally, you might want to clear the input field or show a success message
        setEmail('');
      } else {
        setMessage(`Error creating invite: ${data.message}`);
      }
    } catch (error) {
      setMessage('An error occurred while creating the invite.');
      console.error('An error occurred:', error);
    }
  };

  return (
    <div>
      <h1>Create Invite</h1>
      <form onSubmit={handleInviteCreation}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
        <button type="submit">Create Invite</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}