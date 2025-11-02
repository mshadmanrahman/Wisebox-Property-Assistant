import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, PaperclipIcon, CloseIcon } from './Icons';

interface InputBarProps {
  onSendMessage: (message: string, file?: File | null) => void;
  isLoading: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to recalculate
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    } else {
        setFilePreview('file'); // non-image preview flag
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const submitForm = () => {
    if ((message.trim() || file) && !isLoading) {
      onSendMessage(message, file);
      setMessage('');
      handleRemoveFile();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitForm();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
      {file && (
        <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
                {filePreview && filePreview.startsWith('data:image') && (
                    <img src={filePreview} alt="preview" className="w-12 h-12 rounded-md object-cover" />
                )}
                <div className="truncate">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{Math.round(file.size / 1024)} KB</p>
                </div>
            </div>
            <button
                onClick={handleRemoveFile}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label="Remove file"
            >
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
          aria-label="Attach file"
        >
          <PaperclipIcon className="w-6 h-6" />
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={isLoading}
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 disabled:opacity-50 resize-none overflow-y-auto"
          style={{maxHeight: '120px'}}
        />
        <button
          type="submit"
          disabled={isLoading || (!message.trim() && !file)}
          className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default InputBar;
