
import React from 'react';

interface ActionsDisplayProps {
  actions: string | null;
}

const ActionsDisplay: React.FC<ActionsDisplayProps> = ({ actions }) => {
  const actionItems = actions
    ? actions.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-full">
      <h2 className="text-lg font-bold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Next Actions</h2>
      {actionItems.length > 0 ? (
        <ul className="space-y-2">
          {actionItems.map((item, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="text-blue-500 mr-2 mt-1">&#10003;</span>
              <span>{item.replace(/[-*]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          Suggested next steps will appear here.
        </div>
      )}
    </div>
  );
};

export default ActionsDisplay;
