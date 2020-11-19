import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function Message(props) {
  const { text } = props;
  return <li>{text}</li>;
}

export default function Chat() {
  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log('Is this running?');
    const newSocket = io(':5000');
    setSocket(newSocket);
    return () => newSocket.disconnect(true);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('welcome', (data) => {
      setMessages((m) => [...m, data]);
    });
    socket.emit('join');
    return () => socket.off('welcome');
  }, [socket]);

  return (
    <ul>
      {messages.map((text, index) => (
        <Message text={text} key={index} />
      ))}
    </ul>
  );
}
