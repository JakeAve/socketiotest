import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(io(process.env.REACT_APP_SOCKETIO_PORT));

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket] = useState(useSocket());
  useEffect(() => {
    socket.on('log', (d) => console.log(d));
    socket.on('disconnect', () => socket.open());
    return () => socket.disconnect(true);
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
