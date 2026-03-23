import React from 'react';
import { RELATED_RECORDS } from '../constants';
import { Factory, FileText, Database, Activity, ShieldCheck, MoreHorizontal, Volume2 } from 'lucide-react';

const RelatedPanel: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'factory': return <Factory size={18} className="text-blue-500" />;
      case 'list': return <FileText size={18} className="text-orange-500" />;
      case 'database': return <Database size={18} className="text-green-500" />;
      case 'activity': return <Activity size={18} className="text-indigo-500" />;
      case 'shield': return <ShieldCheck size={18} className="text-purple-500" />;
      default: return <FileText size={18} />;
    }
  };

  const getBg = (iconName: string) => {
      switch (iconName) {
      case 'factory': return 'bg-blue-100';
      case 'list': return 'bg-orange-100';
      case 'database': return 'bg-green-100';
      case 'activity': return 'bg-indigo-100';
      case 'shield': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  }

  return (
    <div className="w-72 bg-gray-50/50 border-l border-gray-200 h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">相关记录</h2>
        <div className="flex gap-2 text-gray-400">
             <Volume2 size={16} className="cursor-pointer hover:text-gray-600" />
             <MoreHorizontal size={16} className="cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      <div className="space-y-3">
        {RELATED_RECORDS.map((record) => (
          <div key={record.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${getBg(record.icon)} flex items-center justify-center flex-shrink-0`}>
                {getIcon(record.icon)}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{record.title}</h3>
                <p className="text-xs text-gray-500">{record.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPanel;