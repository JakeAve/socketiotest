import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../context/userContext';

export default function StartForm() {
  const [userName, setUserName] = useState('');
  const { user, setUser } = useUser();
  const history = useHistory();

  useEffect(() => {
    if (user) history.push('/chat/new');
  }, [user, history]);

  const onSubmit = (e) => {
    e.preventDefault();
    setUser(userName);
    history.push('/chat/new');
  };

  return (
    <div>
      <form className="login-form" onSubmit={onSubmit}>
        <label htmlFor="username">
          Enter the username you would like to use:
        </label>
        <input
          id="username"
          type="text"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
        <input type="submit" />
      </form>
    </div>
  );
}
