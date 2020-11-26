import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useSocket } from '../context/socketContext';
import { useUser } from '../context/userContext';

export default function ChatRooms(props) {
  const { toggleState: setToggle } = props;
  const [chatrooms, setChatrooms] = useState([]);
  const [newChatroom, setNewChatroom] = useState('');
  const { user } = useUser();
  const inputEl = useRef();
  const submitEl = useRef();
  const socket = useSocket();
  const history = useHistory();
  const { chatroom } = useParams();

  useEffect(() => {
    socket.emit('get-chatrooms');
    socket.on('chatrooms', (d) => setChatrooms(d));
    return () => socket.off('chatrooms');
  }, [socket]);

  const createNewChatroom = (e) => {
    e.preventDefault();
    if (newChatroom.trim() && newChatroom !== 'new') {
      socket.emit('new-chatroom', newChatroom, user);
      history.push(`/chat/${newChatroom}`);
      setNewChatroom('');
      inputEl.current.blur();
      submitEl.current.blur();
    } else alert('Name not allowed. Choose a different one.');
  };

  const ChatRoom = (props) => {
    const { name } = props;
    return (
      <li className={chatroom === name ? 'selected' : ''}>
        <Link to={`/chat/${name}`} onClick={() => setToggle(false)}>
          {name}
        </Link>
      </li>
    );
  };

  return (
    <aside className="chat-rooms">
      <form className="new-chatroom-form" onSubmit={createNewChatroom}>
        <label htmlFor="new-chat">Create New Chat</label>
        <input
          type="text"
          id="new-chat"
          placeholder="chatroom-name"
          ref={inputEl}
          onChange={(e) => setNewChatroom(e.target.value.replace(/\s+/g, '-'))}
          value={newChatroom}
        />
        <input ref={submitEl} type="submit" value="Create" />
      </form>
      {chatrooms.length ? (
        <ul>
          {chatrooms.map((name, index) => (
            <ChatRoom name={name} key={index} />
          ))}
        </ul>
      ) : (
        <div className="no-chats">
          No existing chats available. Create a new one.
        </div>
      )}
    </aside>
  );
}
