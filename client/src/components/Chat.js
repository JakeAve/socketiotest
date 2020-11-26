import React, { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { useSocket } from '../context/socketContext';
import { useParams } from 'react-router-dom';
import MessagesContainer from './MessagesContainer';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const { user } = useUser();
  const socket = useSocket();
  const { chatroom } = useParams();
  const [refTime, setRefTime] = useState(new Date());

  useEffect(() => {
    const int = setInterval(() => setRefTime(new Date()), 60000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('receive-message', (data) => {
      setRefTime(new Date());
      setMessages((m) => [...m, data]);
    });
    socket.emit('join', user, chatroom);
    return () => {
      socket.off('receive-message');
    };
  }, [socket, user, chatroom]);

  useEffect(() => {
    if (!socket) return;
    socket.on('all-messages', (messages) => {
      if (Array.isArray(messages)) setMessages(messages);
    });
    socket.emit('get-messages', chatroom);
    return () => socket.off('all-messages');
  }, [socket, chatroom]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageText) {
      const message = {
        text: messageText,
        sender: user,
        time: new Date().toISOString(),
      };
      socket.emit('send-message', message, chatroom);
      setRefTime(new Date());
      setMessages((m) => [...m, message]);
      setMessageText('');
    }
  };

  return (
    <main className="chat">
      {messages.length ? (
        <MessagesContainer messages={messages} refTime={refTime} />
      ) : (
        <div className="prompt">Type the first message for this chat</div>
      )}
      <form className="new-message" onSubmit={sendMessage}>
        <input
          type="text"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
          placeholder="message..."
        />
        <input type="submit" value="Send" />
      </form>
    </main>
  );
}
