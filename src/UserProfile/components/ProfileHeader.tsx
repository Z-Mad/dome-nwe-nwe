import React from 'react';
import { BadgeCheck, ShoppingBag, Home, HardHat } from 'lucide-react';

interface ProfileHeaderProps {
  displayAccount: {
    avatar: string;
    displayName: string;
    orgInfo: string;
  };
  consoleMode: 'buyer' | 'seller';
  setConsoleMode: (mode: 'buyer' | 'seller') => void;
  isViewer: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  displayAccount,
  consoleMode,
  setConsoleMode,
  isViewer,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden ring-4 ring-gray-50 relative group">
          <img src={displayAccount.avatar} className="w-full h-full object-cover" alt="avatar" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">{displayAccount.displayName}</h2>
            <BadgeCheck size={20} className="text-blue-500 fill-blue-50" />
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">{displayAccount.orgInfo}</div>
        </div>
      </div>

      <div className="flex bg-gray-100 p-1.5 rounded-xl">
        <button
          onClick={() => setConsoleMode('buyer')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
            consoleMode === 'buyer'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingBag size={16} /> 采购工作台
        </button>
        {isViewer ? (
          <button
            onClick={() => setConsoleMode('seller')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              consoleMode === 'seller'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <Home size={16} /> 开发者控制台
          </button>
        ) : (
          <button
            disabled
            className="px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 text-gray-300 cursor-not-allowed"
          >
            <HardHat size={14} /> 开发者控制台
          </button>
        )}
      </div>
    </div>
  );
};