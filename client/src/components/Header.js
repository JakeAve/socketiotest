import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/userContext';

export default function Header() {
  const { user } = useUser();
  return (
    <header>
      <h1 className="main-title" title="Ghetto Express React Node Chat">
        Gern Chat
      </h1>
      <nav>
        <ul>
          <li>
            {user ? (
              <Link to="/logout">Logout as {user}</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
