import React, { useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useUser } from '../context/userContext';
import Chat from './Chat';
import ChatRooms from './ChatRooms';

export default function MainView() {
  const { user } = useUser();
  const { chatroom } = useParams();
  const [toggle, setToggle] = useState(true);

  if (!user) return <Redirect to="/login" />;
  return (
    <section className="main-view">
      <label htmlFor="toggle">&lt; Chatrooms</label>
      <input
        id="toggle"
        type="checkbox"
        checked={toggle}
        onChange={(e) => setToggle(e.target.checked)}
      />
      <ChatRooms toggleState={setToggle} />
      {chatroom === 'new' ? (
        <main>
          <div className="prompt">
            Start a new chat or choose an existing chat
          </div>
        </main>
      ) : (
        <Chat />
      )}
    </section>
  );
}
