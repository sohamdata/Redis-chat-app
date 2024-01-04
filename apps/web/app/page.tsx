'use client'

import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketProvider';

export default function Page(): JSX.Element {

  const { sendMessage } = useSocket();

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
    </main>
  );
}
