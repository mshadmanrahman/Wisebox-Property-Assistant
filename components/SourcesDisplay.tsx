import React from 'react';
import { Source } from '../types';

interface SourcesDisplayProps {
  sources: Source[] | null;
}

const SourcesDisplay: React.FC<SourcesDisplayProps> = ({ sources }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Sources</h2>
      {sources && sources.length > 0 ? (
        <ul className="space-y-2">
          {sources.map((source, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="text-gray-400 dark:text-gray-500 mr-2 mt-1">&#128279;</span>
              <a 
                href={source.web.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
                title={source.web.uri}
              >
                {source.web.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          Sources from the web will appear here when available.
        </div>
      )}
    </div>
  );
};

export default SourcesDisplay;
