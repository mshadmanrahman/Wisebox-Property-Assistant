
import React from 'react';
import { DisplayMessage } from '../types';
import { UserIcon, BotIcon } from './Icons';

interface MessageProps {
  message: DisplayMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            return (
                <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={isUser ? "text-blue-200 hover:underline" : "text-blue-500 hover:underline"}
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};


  if (message.isLoading) {
    return (
      <div className="flex items-start space-x-3 my-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <BotIcon className="w-5 h-5 text-gray-500" />
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-lg">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
          <BotIcon className="w-5 h-5" />
        </div>
      )}
      <div
        className={`rounded-lg p-3 max-w-lg ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}
      >
        {message.file && (
            <div className="mb-2">
                {message.file.type.startsWith('image/') ? (
                    <img src={message.file.url} alt={message.file.name} className="max-w-xs max-h-48 rounded-md object-contain"/>
                ) : (
                    <div className="bg-blue-400 p-2 rounded-md">
                        <p className="text-xs font-semibold truncate">{message.file.name}</p>
                        <p className="text-xs opacity-80">{message.file.type}</p>
                    </div>
                )}
            </div>
        )}
        {message.naturalReply && <p className="text-sm whitespace-pre-wrap">{renderTextWithLinks(message.naturalReply)}</p>}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </div>
      )}
    </div>
  );
};

export default Message;
