import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/socketContext';
import { useUser } from '../context/userContext';

export default function Logout() {
  const { user, setUser } = useUser();
  const socket = useSocket();
  useEffect(() => {
    if (user) {
      setUser(null);
      if (socket) socket.emit('logout');
    }
  }, [socket, user, setUser]);
  return (
    <main>
      <div className="prompt">
        You have been logged out.{' '}
        <Link to="/login">Click here to log back in</Link>
      </div>
    </main>
  );
}
