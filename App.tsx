import React, { useState, useEffect, useCallback } from 'react';
import StatusBar from './components/StatusBar';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import SourcesDisplay from './components/SourcesDisplay';
import { sendMessageToGemini, parseGeminiResponse } from './services/geminiService';
import { DisplayMessage, DocStatus, Source } from './types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is "data:mime/type;base64,the-base64-string"
      // we need to strip the prefix
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};


const App: React.FC = () => {
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [profile, setProfile] = useState<object | null>(null);
  const [actions, setActions] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[] | null>(null);
  const [status, setStatus] = useState<DocStatus>(DocStatus.UNKNOWN);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getInitialMessage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSources(null);
    const loadingMessageId = Date.now().toString();
    setDisplayMessages([{
      id: loadingMessageId,
      role: 'model',
      naturalReply: '',
      isLoading: true
    }]);

    try {
      const response = await sendMessageToGemini("Hello, please provide a greeting to start the conversation.");
      const { naturalReply, profile, actions, status, sources } = parseGeminiResponse(response);
      
      const botMessage: DisplayMessage = {
        id: Date.now().toString(),
        role: 'model',
        naturalReply: naturalReply,
      };

      setDisplayMessages([botMessage]);
      setProfile(profile);
      setActions(actions);
      setStatus(status);
      setSources(sources);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      const errorMsg: DisplayMessage = {
        id: Date.now().toString(),
        role: 'model',
        naturalReply: `Error: ${errorMessage}`
      };
      setDisplayMessages(prev => prev.filter(m => m.id !== loadingMessageId).concat(errorMsg));
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    getInitialMessage();
  }, [getInitialMessage]);

  const handleSendMessage = async (message: string, file?: File | null) => {
    setIsLoading(true);
    setError(null);
    setSources(null);

    const userMessage: DisplayMessage = {
      id: Date.now().toString(),
      role: 'user',
      naturalReply: message,
    };

    if (file) {
        userMessage.file = {
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
        };
    }
    
    const loadingMessageId = (Date.now() + 1).toString();
    const loadingMessage: DisplayMessage = {
      id: loadingMessageId,
      role: 'model',
      naturalReply: '',
      isLoading: true,
    }

    setDisplayMessages((prevMessages) => [...prevMessages, userMessage, loadingMessage]);

    try {
      let fileData: { data: string; mimeType: string } | undefined;
      if (file) {
        const base64Data = await fileToBase64(file);
        fileData = { data: base64Data, mimeType: file.type };
      }

      const response = await sendMessageToGemini(message, fileData);
      const { naturalReply, profile, actions, status, sources } = parseGeminiResponse(response);

      const botMessage: DisplayMessage = {
        id: Date.now().toString(),
        role: 'model',
        naturalReply: naturalReply,
      };

      setDisplayMessages(prev => prev.filter(m => m.id !== loadingMessageId).concat(botMessage));
      setProfile(profile);
      setActions(actions);
      setStatus(status);
      setSources(sources);

    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      const errorMsg: DisplayMessage = {
        id: Date.now().toString(),
        role: 'model',
        naturalReply: `Error: ${errorMessage}`
      };
      setDisplayMessages(prev => prev.filter(m => m.id !== loadingMessageId).concat(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col h-screen font-sans">
      <header className="p-4 bg-white dark:bg-gray-800 shadow-md z-10">
        <h1 className="text-xl font-bold text-center">WiseBox Property Assistant</h1>
      </header>
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
        
        {/* Center Panel */}
        <div className="w-full md:flex-1 order-1 md:order-2 flex flex-col min-h-0 shadow-lg rounded-lg">
            <StatusBar status={status} />
            <ChatWindow messages={displayMessages} />
            <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
        
        {/* Right Panel */}
        <div className="w-full md:w-1/4 order-3 md:order-3 flex flex-col gap-4 overflow-y-auto">
            <SourcesDisplay sources={sources} />
        </div>
      </main>
    </div>
  );
};

export default App;
