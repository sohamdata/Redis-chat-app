'use client'

import { createContext, useCallback, useEffect } from "react";
import { io } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode
}

interface SockerContextProps {
    sendMessage: (message: string) => void;
}

const SocketContext = createContext<SockerContextProps | null>(null);


export const SocketProvider = ({ children }: SocketProviderProps) => {

    const sendMessage = useCallback((message: string) => {
        console.log(message);
    }, []);

    useEffect(() => {

        const _SERVER = io('http://localhost:8000');
        return () => {
            _SERVER.disconnect();
            console.log('dismounted');
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage }}>
            {children}
        </SocketContext.Provider>
    )
}
