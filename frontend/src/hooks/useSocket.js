import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const socketInstance = io(SOCKET_URL, {
      withCredentials: true,
    });

    socketInstance.emit("setup", userId);

    socketInstance.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return {
    socket,
    onlineUsers,
  };
};

export default useSocket;