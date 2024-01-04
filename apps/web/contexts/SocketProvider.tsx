'use client'

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode
}

interface SocketContextProps {
    sendMessage: (message: string) => void;
    messages?: string[];
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

    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage = useCallback((message: string) => {
        if (socket) {
            socket.emit('chat:message-sent', { message: message });
        }
    }, [socket]);

    const handleNewMessage = useCallback((message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log("message received:", message);
    }, []);

    useEffect(() => {

        const _SOCKET = io('http://localhost:8000');
        _SOCKET.on('chat:message-received', handleNewMessage);

        setSocket(_SOCKET);

        return () => {
            console.log('dismounted');
            setSocket(undefined);
            _SOCKET.off('chat:message-received', handleNewMessage);
            _SOCKET.disconnect();
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    )
}
