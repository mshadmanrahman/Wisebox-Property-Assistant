
import React from 'react';

interface ProfileDisplayProps {
  profile: object | null;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profile }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-full">
      <h2 className="text-lg font-bold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Property Profile</h2>
      {profile ? (
        <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-x-auto">
          <code>{JSON.stringify(profile, null, 2)}</code>
        </pre>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          Your property profile will appear here as you provide information.
        </div>
      )}
    </div>
  );
};

export default ProfileDisplay;
