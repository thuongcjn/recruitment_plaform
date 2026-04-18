import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL);
      setSocket(newSocket);

      newSocket.emit('newUser', user._id);

      // We could add online users list here if we implement it on backend
      // newSocket.on('getOnlineUsers', (users) => {
      //   setOnlineUsers(users);
      // });

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
