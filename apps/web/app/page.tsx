'use client'

import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketProvider';

export default function Page(): JSX.Element {

  const { sendMessage, messages } = useSocket();

  const [message, setMessage] = useState('');

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e: any) => {
    sendMessage(message);
    setMessage('');
  };

  return (
    <main>
      <input type="text" value={message} onChange={handleMessageChange} />
      <button onClick={handleSendMessage}>Send</button>

      <h1 style={{ marginTop: 5 }}>Messages</h1>
      <ul>
        {messages?.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </main>
  );
}
