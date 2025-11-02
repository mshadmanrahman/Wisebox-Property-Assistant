
import React, { useEffect, useRef } from 'react';
import { DisplayMessage as DisplayMessageType } from '../types';
import Message from './Message';

interface ChatWindowProps {
  messages: DisplayMessageType[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;
