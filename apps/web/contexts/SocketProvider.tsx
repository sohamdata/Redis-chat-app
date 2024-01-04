'use client'

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode
}

interface SocketContextProps {
    sendMessage: (message: string) => void;
}

const SocketContext = createContext<SocketContextProps | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket>();

    const sendMessage = useCallback((message: string) => {
        if (socket) {
            socket.emit('chat:message-sent', { message: message });
        }
    }, [socket]);


    useEffect(() => {

        const _SERVER = io('http://localhost:8000');
        setSocket(_SERVER);

        return () => {
            console.log('dismounted');
            setSocket(undefined);
            _SERVER.disconnect();
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage }}>
            {children}
        </SocketContext.Provider>
    )
}
