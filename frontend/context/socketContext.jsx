import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:8000", {
            withCredentials: true, // Allows cross-origin cookies
            reconnection: true, // Auto-reconnect on disconnect
            reconnectionAttempts: 5, // Number of retries before failing
            reconnectionDelay: 2000, // Time between retries
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook for using the socket context
export const useSocket = () => useContext(SocketContext);

export default SocketContext;
