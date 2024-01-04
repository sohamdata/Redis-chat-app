'use client'

import React, { createContext, useContext, useCallback, useEffect } from "react";
import { io } from "socket.io-client";

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

    const sendMessage = useCallback((message: string) => {
        console.log(message);
    }, []);

    useEffect(() => {

        const _SERVER = io('http://localhost:8000');
        return () => {
            console.log('dismounted');
            _SERVER.disconnect();
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage }}>
            {children}
        </SocketContext.Provider>
    )
}
